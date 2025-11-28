"use server"
import type { ContactFormData, CourseGroup } from '@/app/contacte/types';

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
