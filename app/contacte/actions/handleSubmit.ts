"use server"
import type { ContactFormData, CourseGroup } from '@/app/contacte/types/form.types';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import { buildEmailMessage } from './buildEmailMessage';
import { buildConfirmationEmail } from './buildConfirmationEmail';
import { getServiceLabel } from './getServiceLabel';
import { siteConfig } from '@/app/_lib/siteConfig';
import { getClientIp, getRawClientIp, checkRateLimitIp, checkRateLimitEmail, recordRateLimitAttemptIp, recordRateLimitAttemptEmail } from '@/app/contacte/lib/rateLimit';
import { verifyTurnstile } from './verifyTurnstile';
import { saveFallbackSubmission } from '@/app/contacte/lib/fallback';
import { promises as dns } from 'dns';

/**
 * Retry configuration for email sending
 */
const RETRY_CONFIG = {
  maxAttempts: 2,
  delayMs: 1000, // 1 second between retries
};

/**
 * Helper to delay execution
 */
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry helper with exponential backoff
 * Attempts to send email multiple times before giving up
 */
const sendEmailWithRetry = async (
  resend: InstanceType<typeof Resend>,
  emailParams: Parameters<typeof Resend.prototype.emails.send>[0],
  attemptNumber = 1
) => {
  try {
    return await resend.emails.send(emailParams);
  } catch (error) {
    if (attemptNumber < RETRY_CONFIG.maxAttempts) {
      console.warn(`[Email] Attempt ${attemptNumber} failed, retrying in ${RETRY_CONFIG.delayMs}ms...`);
      await delay(RETRY_CONFIG.delayMs);
      return sendEmailWithRetry(resend, emailParams, attemptNumber + 1);
    }
    throw error;
  }
};

/**
 * Determines the recipient email based on service type
 * Centre-educatiu (school services) goes to specialized email
 * All other services go to main contact email
 */
const getRecipientEmail = (formData: ContactFormData): string => {
  if (
    formData.serviceType === 'serveis-externs' &&
    formData.externsSubtype === 'centre-educatiu'
  ) {
    return siteConfig.contactEmailSchools;
  }
  return siteConfig.contactEmail;
};

/**
 * Validates email format
 */
const isValidEmail = (email: string): boolean => {
  if (email.length > 254) return false;
  const emailRegex = /^[^\s@"'<>,;]+@[^\s@"'<>,;]+\.[^\s@"'<>,;]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitizes text by removing potentially dangerous characters
 */
const sanitizeText = (text: string): string => {
  return text
    .replace(/<[^>]*>/g, '')  // Remove HTML tags
    .replace(/[<>{}[\]\\]/g, '')  // Remove dangerous characters
    .replace(/[\u0000-\u001F\u007F\u200B-\u200F\u2028-\u202F\uFEFF]/g, '')  // Remove control chars and zero-width/bidi overrides
    .trim();
};

const redactIp = (ip: string): string => {
  if (ip === 'unknown') return 'unknown';
  if (ip.includes(':')) {
    const groups = ip.split(':');
    return groups.slice(0, 4).join(':') + '::*';
  }
  const parts = ip.split('.');
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
  return '*.*.*.*';
};

const redactEmail = (email: string): string => {
  const at = email.indexOf('@');
  if (at === -1) return '***';
  return `***@${email.slice(at + 1)}`;
};

/**
 * Allowed values for enum-typed fields (mirrors form.types.ts)
 * Validated server-side to prevent injection of arbitrary strings into email HTML
 */
const VALID_SERVICE_TYPES = ['general', 'artterapia', 'artperdins', 'serveis-externs'] as const;
const VALID_ARTTHERAPY_FORMATS = ['individual', 'grupal', 'unsure'] as const;
const VALID_PARTICIPANT_AGES = ['adolescent', 'young-adult', 'adult'] as const;
const VALID_EDUCATION_STAGES = ['infantil', 'primaria', 'eso', 'batxillerat'] as const;
const VALID_EXTERNS_SUBTYPES = ['centre-educatiu', 'altres-entitats'] as const;
const VALID_CENTRE_SUBTYPES = ['alumnes', 'professorat'] as const;
const VALID_ENTITY_TYPES = ['ajuntament', 'hospital', 'residencia', 'centre-cultural', 'col-lectiu-empresa', 'entitat-social', 'altres'] as const;
const VALID_AVAILABILITIES = ['morning', 'afternoon', 'anytime'] as const;
const VALID_CONTACT_PREFERENCES = ['email', 'phone', 'whatsapp'] as const;

/**
 * Rejects bot-generated names (low vowel ratio or camelCase generator patterns)
 */
const isPlausibleName = (name: string): boolean => {
  const letters = name.toLowerCase().replace(/[^a-záéíóúàèìòùüïñç]/g, '');
  if (letters.length === 0) return false;

  // Vowel ratio: real Romance-language names ~35–50%; random strings ~15–20%
  const vowels = (letters.match(/[aeiouáéíóúàèìòùüï]/g) ?? []).length;
  if (vowels / letters.length < 0.22) return false;

  // Suspicious: no space + >12 chars + many case transitions = generator pattern
  if (!name.includes(' ') && name.length > 12) {
    const transitions = [...name].filter(
      (c, i) => i > 0 && /[A-Z]/.test(c) !== /[A-Z]/.test(name[i - 1])
    ).length;
    if (transitions > 5) return false;
  }

  return true;
};

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwam.com',
  'sharklasers.com', 'guerrillamailblock.com', 'grr.la', 'guerrillamail.info',
  'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.net', 'guerrillamail.org',
  'spam4.me', 'trashmail.com', 'trashmail.me', 'yopmail.com', 'dispostable.com',
  'fakeinbox.com', 'maildrop.cc', 'spamgourmet.com', 'spamgourmet.net',
  'discard.email', 'mailnull.com', 'spamcowboy.com', 'spamcowboy.net',
]);

const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
};

const MX_CACHE_TTL_POSITIVE = 24 * 60 * 60 * 1000; // 24 hours
const MX_CACHE_TTL_NEGATIVE = 5 * 60 * 1000;        // 5 minutes
const MX_CACHE_MAX_SIZE = 1000;

const mxCache = new Map<string, { valid: boolean; expiresAt: number }>();

const hasValidMx = async (email: string): Promise<boolean> => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;

  const cached = mxCache.get(domain);
  if (cached) {
    if (Date.now() < cached.expiresAt) return cached.valid;
    mxCache.delete(domain);
  }

  try {
    const records = await dns.resolveMx(domain);
    const valid = records.length > 0;
    if (mxCache.size >= MX_CACHE_MAX_SIZE) {
      const firstKey = mxCache.keys().next().value;
      if (firstKey !== undefined) mxCache.delete(firstKey);
    }
    mxCache.set(domain, {
      valid,
      expiresAt: Date.now() + (valid ? MX_CACHE_TTL_POSITIVE : MX_CACHE_TTL_NEGATIVE),
    });
    return valid;
  } catch {
    if (mxCache.size >= MX_CACHE_MAX_SIZE) {
      const firstKey = mxCache.keys().next().value;
      if (firstKey !== undefined) mxCache.delete(firstKey);
    }
    mxCache.set(domain, { valid: false, expiresAt: Date.now() + MX_CACHE_TTL_NEGATIVE });
    return false;
  }
};

/**
 * Server-side validation and sanitization of form data
 * This runs on the server and cannot be bypassed by malicious clients
 *
 * @param formData - The contact form data to validate
 * @returns Object with validation result and sanitized data or error message
 */
export const validateAndSanitize = async (
  formData: ContactFormData
): Promise<{ valid: boolean; data?: ContactFormData; error?: string }> => {
  try {
    // Null/undefined check
    if (!formData) {
      return {
        valid: false,
        error: 'Error al processar les dades. Si us plau, torna-ho a intentar.'
      };
    }

    // ===== HONEYPOT VALIDATION =====
    // Silent rejection if honeypot field is filled (indicates bot)
    if (formData.website && formData.website.trim() !== '') {
      const safeHoneypotValue = JSON.stringify(String(formData.website).slice(0, 50));
      console.log('Bot detected - honeypot field filled:', {
        timestamp: new Date().toISOString(),
        honeypotValue: safeHoneypotValue,
      });
      // Return success to avoid revealing the honeypot
      // The email will never be sent
      return { valid: false, error: 'invalid_honeypot' };
    }

    // ===== SERVER-SIDE VALIDATION =====
    // NEVER trust client data - always validate on server

    // Validate name
    if (!formData.name?.trim() || formData.name.trim().length < 3) {
      return {
        valid: false,
        error: 'El nom és obligatori i ha de tenir almenys 3 caràcters'
      };
    }

    if (!isPlausibleName(formData.name.trim())) {
      return { valid: false, error: 'El nom no és vàlid' };
    }

    // Validate email
    if (!formData.email?.trim() || !isValidEmail(formData.email)) {
      return {
        valid: false,
        error: 'El correu electrònic no és vàlid'
      };
    }

    if (isDisposableEmail(formData.email)) {
      return { valid: false, error: 'No es permeten adreces de correu temporal' };
    }

    if (!await hasValidMx(formData.email)) {
      return { valid: false, error: 'El domini del correu electrònic no és vàlid' };
    }

    // Validate message
    if (!formData.message?.trim() || formData.message.trim().length < 10) {
      return {
        valid: false,
        error: 'El missatge ha de tenir almenys 10 caràcters'
      };
    }

    // Validate message length (prevent spam)
    if (formData.message.length > 5000) {
      return {
        valid: false,
        error: 'El missatge és massa llarg (màxim 5000 caràcters)'
      };
    }

    // Validate privacy acceptance
    if (!formData.privacyAccepted) {
      return {
        valid: false,
        error: 'Has d\'acceptar la política de privacitat'
      };
    }

    // Validate location (obligatory for serveis-externs)
    if (formData.serviceType === 'serveis-externs') {
      if (!formData.location?.trim()) {
        return {
          valid: false,
          error: 'La població és obligatòria per a serveis externs'
        };
      }
    }

    // Validate serveis-externs subtype fields
    if (formData.serviceType === 'serveis-externs') {
      // externsSubtype required
      if (!formData.externsSubtype) {
        return { valid: false, error: 'Has de seleccionar el tipus de col·lectiu' };
      }

      // centre-educatiu required: centreSubtype
      if (formData.externsSubtype === 'centre-educatiu') {
        if (!formData.centreSubtype) {
          return { valid: false, error: 'Has de seleccionar el destinatari de la formació' };
        }
        // schoolName required for professorat
        if (formData.centreSubtype === 'professorat' && !formData.schoolName?.trim()) {
          return { valid: false, error: 'El nom del centre és obligatori per a la formació al professorat' };
        }
      }

      // altres-entitats required: entityType + entityName
      if (formData.externsSubtype === 'altres-entitats') {
        if (!formData.entityType) {
          return { valid: false, error: 'Has de seleccionar el tipus d\'entitat' };
        }
        if (!formData.entityName?.trim()) {
          return { valid: false, error: 'El nom de l\'entitat és obligatori' };
        }
      }

      // Validate numeric counts (if filled)
      if (
        formData.externsSubtype === 'centre-educatiu' &&
        formData.centreSubtype === 'alumnes' &&
        formData.studentsCount !== ''
      ) {
        const count = formData.studentsCount;
        if (typeof count !== 'number' || isNaN(count) || count < 1) {
          return { valid: false, error: 'El nombre d\'estudiants ha de ser almenys 1' };
        }
      }

      if (
        formData.externsSubtype === 'centre-educatiu' &&
        formData.centreSubtype === 'professorat' &&
        formData.teachersCount !== ''
      ) {
        const count = formData.teachersCount;
        if (typeof count !== 'number' || isNaN(count) || count < 1) {
          return { valid: false, error: 'El nombre de professors ha de ser almenys 1' };
        }
      }

      if (formData.externsSubtype === 'altres-entitats') {
        if (formData.participantsCount === '' || formData.participantsCount === null || formData.participantsCount === undefined) {
          return { valid: false, error: 'El nombre de participants és obligatori' };
        }
        const count = formData.participantsCount;
        if (typeof count !== 'number' || isNaN(count) || count < 1) {
          return { valid: false, error: 'El nombre de participants ha de ser almenys 1' };
        }
      }
    }

    // ===== ENUM VALIDATION =====
    // Validate union-typed fields against their allowed values to prevent
    // arbitrary string injection into email HTML by direct Server Action calls
    if (!(VALID_SERVICE_TYPES as readonly string[]).includes(formData.serviceType)) {
      return { valid: false, error: 'Tipus de servei no vàlid' };
    }

    if (formData.availability && !(VALID_AVAILABILITIES as readonly string[]).includes(formData.availability)) {
      return { valid: false, error: 'Disponibilitat no vàlida' };
    }

    if (!Array.isArray(formData.contactPreference)) {
      return { valid: false, error: 'Preferència de contacte no vàlida' };
    }
    if (formData.contactPreference.some(p => !(VALID_CONTACT_PREFERENCES as readonly string[]).includes(p))) {
      return { valid: false, error: 'Preferència de contacte no vàlida' };
    }

    if (formData.serviceType === 'artterapia' && formData.arttherapyFormat && !(VALID_ARTTHERAPY_FORMATS as readonly string[]).includes(formData.arttherapyFormat)) {
      return { valid: false, error: 'Format d\'artteràpia no vàlid' };
    }

    if (formData.serviceType === 'artperdins' && formData.participantAge && !(VALID_PARTICIPANT_AGES as readonly string[]).includes(formData.participantAge)) {
      return { valid: false, error: 'Edat del participant no vàlida' };
    }

    if (formData.serviceType === 'serveis-externs') {
      if (formData.externsSubtype && !(VALID_EXTERNS_SUBTYPES as readonly string[]).includes(formData.externsSubtype)) {
        return { valid: false, error: 'Subtipus de serveis externs no vàlid' };
      }
      if (formData.externsSubtype === 'centre-educatiu') {
        if (formData.centreSubtype && !(VALID_CENTRE_SUBTYPES as readonly string[]).includes(formData.centreSubtype)) {
          return { valid: false, error: 'Subtipus de centre no vàlid' };
        }
        if (formData.educationStage && !(VALID_EDUCATION_STAGES as readonly string[]).includes(formData.educationStage)) {
          return { valid: false, error: 'Etapa educativa no vàlida' };
        }
      }
      if (formData.externsSubtype === 'altres-entitats') {
        if (formData.entityType && !(VALID_ENTITY_TYPES as readonly string[]).includes(formData.entityType)) {
          return { valid: false, error: 'Tipus d\'entitat no vàlid' };
        }
      }
    }

    // ===== SANITIZE INPUTS =====
    // Clean all text inputs to prevent XSS
    const sanitizedData: ContactFormData = {
      ...formData,
      name: sanitizeText(formData.name),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone ? sanitizeText(formData.phone) : '',
      location: formData.location ? sanitizeText(formData.location) : '',
      message: sanitizeText(formData.message),
      schoolName: formData.schoolName ? sanitizeText(formData.schoolName) : '',
      courseGroup: formData.courseGroup
        ? (sanitizeText(formData.courseGroup) as CourseGroup)
        : '',
      courseInterest: formData.courseInterest ? sanitizeText(formData.courseInterest) : '',
      studentsCount: typeof formData.studentsCount === 'number'
        ? Math.floor(Math.min(10_000, Math.max(1, formData.studentsCount)))
        : '',
      teachersCount: typeof formData.teachersCount === 'number'
        ? Math.floor(Math.min(10_000, Math.max(1, formData.teachersCount)))
        : '',
      trainingInterest: formData.trainingInterest ? sanitizeText(formData.trainingInterest) : '',
      entityName: formData.entityName ? sanitizeText(formData.entityName) : '',
      entityDescription: formData.entityDescription ? sanitizeText(formData.entityDescription) : '',
      participantsCount: typeof formData.participantsCount === 'number'
        ? Math.floor(Math.min(10_000, Math.max(1, formData.participantsCount)))
        : '',
      projectDescription: formData.projectDescription ? sanitizeText(formData.projectDescription) : '',
      // Keep availability as-is since it's a union type
      availability: formData.availability || '',
      // Clear honeypot field
      website: '',
    };

    return { valid: true, data: sanitizedData };
  } catch (error) {
    console.error('Error during validation:', error);
    return {
      valid: false,
      error: 'Error al processar les dades. Si us plau, torna-ho a intentar.'
    };
  }
};

/**
 * Handle complete form submission: validate, build email, and send via Resend
 *
 * @param formData - The contact form data
 * @returns Success status with message ID or error details
 */
export const handleFormSubmit = async (
  formData: ContactFormData
): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
  message?: string;
}> => {
  // Declared outside try so the outer catch can use sanitized data for fallback storage
  let sanitizedData: ContactFormData | null = null;

  try {
    // 0. Extract client IP
    const requestHeaders = await headers();
    const clientIp = getClientIp(requestHeaders);
    const rawClientIp = getRawClientIp(requestHeaders);

    // 0a. Cloudflare Turnstile verification — must run BEFORE rate limit,
    //     honeypot, and any DNS/MX lookups so that unverified clients
    //     cannot trigger downstream cost or consume rate-limit buckets.
    const turnstile = await verifyTurnstile(
      formData?.turnstileToken ?? '',
      rawClientIp
    );
    if (!turnstile.ok) {
      console.warn(`[Turnstile] rejected submission: reason=${turnstile.reason}`);
      return {
        success: false,
        error: 'captcha_failed',
        message: 'Verificació de seguretat fallida. Si us plau, torna-ho a intentar.',
      };
    }

    // 0b. Rate limiting check (IP-based)
    if (checkRateLimitIp(clientIp)) {
      console.warn(`[Rate Limit] IP exceeded for IP: ${redactIp(clientIp)}`);
      return {
        success: false,
        error: 'rate_limit_exceeded',
        message: 'Has enviat massa consultes. Torna-ho a intentar en alguns minuts.',
      };
    }

    // 1. Validate and sanitize
    const validation = await validateAndSanitize(formData);
    if (!validation.valid || !validation.data) {
      // Record failed attempt for rate limiting
      recordRateLimitAttemptIp(clientIp);
      return {
        success: false,
        error: validation.error || 'Validation failed',
      };
    }

    sanitizedData = validation.data;

    // Defense-in-depth: token is single-use and already consumed by siteverify
    // above, but strip it from any object that may be persisted to fallback
    // storage or logs.
    sanitizedData.turnstileToken = '';

    // Record IP attempt for every submission that passes validation
    recordRateLimitAttemptIp(clientIp);

    // 2. Email-based rate limit check (prevents spam to third-party emails)
    if (checkRateLimitEmail(sanitizedData.email)) {
      console.warn(`[Rate Limit] Email exceeded for: ${redactEmail(sanitizedData.email)}`);
      return {
        success: false,
        error: 'rate_limit_exceeded',
        message: 'Massa consultes des d\'aquest email. Torna-ho a intentar en alguns minuts.',
      };
    }

    // Record email attempt for every submission that passes email rate-limit check
    recordRateLimitAttemptEmail(sanitizedData.email);

    // 3. Build email message
    const emailContent = await buildEmailMessage(sanitizedData);

    // 4. Send via Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return {
        success: false,
        error: 'email_send_failed',
        message: 'Configuration error. Please try again later.',
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email to Miriam (business) - route to correct email based on service type
    const recipientEmail = getRecipientEmail(sanitizedData);

    let businessResult;
    try {
      businessResult = await sendEmailWithRetry(resend, {
        from: `contact@${new URL(siteConfig.siteUrl).hostname.replace(/^www\./, '')}`,
        to: recipientEmail,
        replyTo: sanitizedData.email,
        subject: `Nova consulta: ${getServiceLabel(sanitizedData.serviceType)}`,
        html: emailContent,
      });
    } catch (error) {
      // Business email failed after retries
      console.error('Resend API error (business email, after retries):', error);

      // Try to save fallback submission
      await saveFallbackSubmission(
        sanitizedData,
        `Email send failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );

      return {
        success: false,
        error: 'email_send_failed',
        message: 'Error tècnic enviant el correu. Si us plau, torna-ho a intentar o contacta\'ns directament.',
      };
    }

    if (businessResult.error) {
      console.error('Resend API error (business email):', businessResult.error);

      // Try to save fallback submission
      await saveFallbackSubmission(
        sanitizedData,
        `Resend error: ${businessResult.error}`
      );

      return {
        success: false,
        error: 'email_send_failed',
        message: 'Error tècnic enviant el correu. Si us plau, torna-ho a intentar o contacta\'ns directament.',
      };
    }

    // Build and send confirmation email to user (non-critical)
    const confirmationContent = await buildConfirmationEmail(sanitizedData);

    try {
      const confirmationResult = await sendEmailWithRetry(resend, {
        from: `contact@${new URL(siteConfig.siteUrl).hostname.replace(/^www\./, '')}`,
        to: sanitizedData.email,
        subject: 'Confirmació de rebuda - Taller dels Sentits',
        html: confirmationContent,
      });

      if (confirmationResult.error) {
        console.error('Resend API error (confirmation email):', confirmationResult.error);
        // Log but don't fail - we sent the business email successfully
      }
    } catch (error) {
      console.error('Confirmation email send failed (non-critical):', error);
      // Don't fail the whole request - business email was sent successfully
    }

    return {
      success: true,
      messageId: businessResult.data?.id,
      message: 'Consulta enviada correctament',
    };
  } catch (error) {
    console.error('Error submitting form:', error);

    // Try to save fallback for catastrophic errors
    // Use sanitizedData if validation already completed, otherwise fall back to raw formData
    const fallbackData = { ...(sanitizedData ?? formData), turnstileToken: '' };
    await saveFallbackSubmission(
      fallbackData,
      `Catastrophic error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );

    return {
      success: false,
      error: 'email_send_failed',
      message: 'Error tècnic enviant el correu. Si us plau, torna-ho a intentar o contacta\'ns directament.',
    };
  }
};
