"use server"
import type { ContactFormData, CourseGroup } from '@/app/contacte/types';
import { verifyRecaptcha } from './verifyRecaptcha';

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
    // ===== reCAPTCHA ENTERPRISE VERIFICATION =====
    // Verify the token on the server with Google's API
    // This prevents bots from bypassing client-side validation
    if (!formData.recaptchaToken) {
      console.log('🚨 No reCAPTCHA token provided');
      return {
        valid: false,
        error: 'Verificació de seguretat fallida. Si us plau, recarrega la pàgina.'
      };
    }

    const recaptchaResult = await verifyRecaptcha(formData.recaptchaToken);
    if (!recaptchaResult.success) {
      console.log('🚨 reCAPTCHA verification failed:', recaptchaResult.error);
      return {
        valid: false,
        error: recaptchaResult.error || 'Verificació de seguretat fallida. Si us plau, torna-ho a intentar.'
      };
    }

    console.log(`✅ reCAPTCHA verified - Score: ${recaptchaResult.score}`);

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

    // Validate location (obligatory for centres-educatius)
    if (formData.serviceType === 'centres-educatius') {
      if (!formData.location?.trim()) {
        return { 
          valid: false,
          error: 'La població és obligatòria per a centres educatius' 
        };
      }
    }

    // Validate studentsCount (if service is centres-educatius)
    if (formData.serviceType === 'centres-educatius' && formData.studentsCount !== '') {
      const count = formData.studentsCount;
      
      if (typeof count !== 'number' || isNaN(count)) {
        return { 
          valid: false,
          error: 'El nombre d\'estudiants ha de ser un valor numèric' 
        };
      }
      
      if (count < 1) {
        return { 
          valid: false,
          error: 'El nombre d\'estudiants ha de ser almenys 1' 
        };
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
