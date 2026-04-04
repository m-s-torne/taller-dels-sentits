"use server"
import type { ContactFormData, CourseGroup } from '@/app/contacte/types/form.types';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import { buildEmailMessage } from './buildEmailMessage';
import { buildConfirmationEmail } from './buildConfirmationEmail';
import { getServiceLabel } from './getServiceLabel';
import { siteConfig } from '@/app/_lib/siteConfig';
import { getClientIp, checkRateLimitIp, checkRateLimitEmail, recordRateLimitAttemptIp, recordRateLimitAttemptEmail } from '@/app/contacte/lib/rateLimit';
import { saveFallbackSubmission } from '@/app/contacte/lib/fallback';

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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitizes text by removing potentially dangerous characters
 */
const sanitizeText = (text: string): string => {
  return text
    .replace(/<[^>]*>/g, '')  // Remove HTML tags
    .replace(/[<>{}[\]\\]/g, '')  // Remove dangerous characters
    .trim();
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
      console.log('🤖 Bot detected - honeypot field filled:', {
        timestamp: new Date().toISOString(),
        honeypotValue: formData.website
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

    // Validate email
    if (!formData.email?.trim() || !isValidEmail(formData.email)) {
      return {
        valid: false,
        error: 'El correu electrònic no és vàlid'
      };
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
        ? Math.floor(Math.max(1, formData.studentsCount))
        : '',
      teachersCount: typeof formData.teachersCount === 'number'
        ? Math.floor(Math.max(1, formData.teachersCount))
        : '',
      trainingInterest: formData.trainingInterest ? sanitizeText(formData.trainingInterest) : '',
      entityName: formData.entityName ? sanitizeText(formData.entityName) : '',
      entityDescription: formData.entityDescription ? sanitizeText(formData.entityDescription) : '',
      participantsCount: typeof formData.participantsCount === 'number'
        ? Math.floor(Math.max(1, formData.participantsCount))
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
    // 0. Rate limiting check (IP-based)
    const requestHeaders = await headers();
    const clientIp = getClientIp(requestHeaders);

    if (checkRateLimitIp(clientIp)) {
      console.warn(`[Rate Limit] IP exceeded for IP: ${clientIp}`);
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

    // 2. Email-based rate limit check (prevents spam to third-party emails)
    if (checkRateLimitEmail(sanitizedData.email)) {
      console.warn(`[Rate Limit] Email exceeded for: ${sanitizedData.email}`);
      recordRateLimitAttemptIp(clientIp);
      return {
        success: false,
        error: 'rate_limit_exceeded',
        message: 'Massa consultes des d\'aquest email. Torna-ho a intentar en alguns minuts.',
      };
    }

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
        from: `contact@${new URL(siteConfig.siteUrl).hostname}`,
        to: recipientEmail,
        replyTo: sanitizedData.email,
        subject: `Nova consulta: ${getServiceLabel(sanitizedData.serviceType)}`,
        html: emailContent,
      });
    } catch (error) {
      // Business email failed after retries
      console.error('Resend API error (business email, after retries):', error);

      // Try to save fallback submission
      const fallbackSaved = await saveFallbackSubmission(
        sanitizedData,
        `Email send failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );

      recordRateLimitAttemptIp(clientIp);
      return {
        success: false,
        error: 'email_send_failed',
        message: fallbackSaved
          ? 'Technical issue sending email. We have recorded your submission and will contact you shortly.'
          : 'Failed to send email. Please try again later or contact us directly.',
      };
    }

    if (businessResult.error) {
      console.error('Resend API error (business email):', businessResult.error);

      // Try to save fallback submission
      const fallbackSaved = await saveFallbackSubmission(
        sanitizedData,
        `Resend error: ${businessResult.error}`
      );

      recordRateLimitAttemptIp(clientIp);
      return {
        success: false,
        error: 'email_send_failed',
        message: fallbackSaved
          ? 'Technical issue sending email. We have recorded your submission and will contact you shortly.'
          : 'Failed to send email. Please try again later.',
      };
    }

    // Build and send confirmation email to user (non-critical)
    const confirmationContent = await buildConfirmationEmail(sanitizedData);

    try {
      const confirmationResult = await sendEmailWithRetry(resend, {
        from: `contact@${new URL(siteConfig.siteUrl).hostname}`,
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

    // Record successful email submission for rate limiting
    recordRateLimitAttemptEmail(sanitizedData.email);

    return {
      success: true,
      messageId: businessResult.data?.id,
      message: 'Consulta enviada correctament',
    };
  } catch (error) {
    console.error('Error submitting form:', error);

    // Try to save fallback for catastrophic errors
    // Use sanitizedData if validation already completed, otherwise fall back to raw formData
    const clientIp = getClientIp(await headers());
    const fallbackSaved = await saveFallbackSubmission(
      sanitizedData ?? formData,
      `Catastrophic error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );

    return {
      success: false,
      error: 'email_send_failed',
      message: fallbackSaved
        ? 'Technical issue. We have recorded your submission and will contact you shortly.'
        : 'An unexpected error occurred. Please try again later.',
    };
  }
};
