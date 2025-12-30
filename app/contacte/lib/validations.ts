import type { ContactFormData } from '@/app/contacte/types';

/**
 * Client-side form field validation functions
 * These provide real-time feedback to users as they fill the form
 */

/**
 * Validates email format
 */
export const validateEmail = (email: string): string | undefined => {
  if (!email) return undefined; // No error if empty
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Correu electrònic no vàlid';
  }
  return undefined;
};

/**
 * Validates name field
 */
export const validateName = (name: string): string | undefined => {
  if (!name) return undefined; // No error if empty
  
  if (name.length < 3) {
    return 'El nom ha de tenir almenys 3 caràcters';
  }
  return undefined;
};

/**
 * Validates message field
 */
export const validateMessage = (message: string): string | undefined => {
  if (!message) return undefined; // No error if empty
  
  if (message.length < 10) {
    return 'El missatge ha de tenir almenys 10 caràcters';
  }
  return undefined;
};

/**
 * Validates studentsCount field (for centres-educatius)
 */
export const validateStudentsCount = (count: number | ''): string | undefined => {
  if (count === '') return undefined; // No error if empty
  
  if (typeof count !== 'number' || isNaN(count)) {
    return 'El nombre ha de ser un valor numèric';
  }
  
  if (count < 1) {
    return 'El nombre d\'estudiants ha de ser almenys 1';
  }
  
  return undefined;
};

/**
 * Validates location field (obligatory for centres-educatius)
 */
export const validateLocation = (
  location: string, 
  serviceType: string, 
  isTouched: boolean = false
): string | undefined => {
  if (serviceType === 'centres-educatius' && !location.trim() && isTouched) {
    return 'La població és obligatòria per a centres educatius';
  }
  return undefined;
};

/**
 * Validates a specific form field based on field name
 * Used for real-time validation during form input
 */
export const validateField = (
  field: keyof ContactFormData,
  value: ContactFormData[keyof ContactFormData],
  formData: ContactFormData,
  touchedFields: Set<string>
): string | undefined => {
  switch (field) {
    case 'email':
      return validateEmail(value as string);
    case 'name':
      return validateName(value as string);
    case 'message':
      return validateMessage(value as string);
    case 'studentsCount':
      return validateStudentsCount(value as number | '');
    case 'location':
      return validateLocation(value as string, formData.serviceType, touchedFields.has('location'));
    default:
      return undefined;
  }
};

/**
 * Validates complete form before submission
 * Returns an object with validation errors for each field
 */
export const validateCompleteForm = (
  formData: ContactFormData
): { name?: string; email?: string; message?: string; location?: string; privacy?: string } => {
  const newErrors: { name?: string; email?: string; message?: string; location?: string; privacy?: string } = {};

  // Validate required fields
  if (!formData.name) {
    newErrors.name = 'El nom és obligatori';
  } else {
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
  }

  if (!formData.email) {
    newErrors.email = 'El correu electrònic és obligatori';
  } else {
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
  }

  if (!formData.message) {
    newErrors.message = 'El missatge és obligatori';
  } else {
    const messageError = validateMessage(formData.message);
    if (messageError) newErrors.message = messageError;
  }

  if (!formData.privacyAccepted) {
    newErrors.privacy = 'Has d\'acceptar la política de privacitat';
  }

  // Validate location for centres-educatius
  if (formData.serviceType === 'centres-educatius') {
    const locationError = validateLocation(formData.location, formData.serviceType);
    if (locationError) {
      newErrors.location = locationError;
    }
  }

  return newErrors;
};

/**
 * Checks if the form is valid for submission (enables/disables submit button)
 * Validates required fields and checks for any validation errors
 */
export const isFormValid = (
  formData: ContactFormData,
  errors: { name?: string; email?: string; message?: string; location?: string; privacy?: string }
): boolean => {
  // Required fields must be filled
  const hasRequiredFields = !!(
    formData.name &&
    formData.email &&
    formData.message &&
    formData.privacyAccepted
  );

  // For centres-educatius, location is also required
  const hasLocationIfRequired = formData.serviceType !== 'centres-educatius' || !!formData.location.trim();

  // Check only string error fields (not nested objects)
  const hasNoErrors = !errors.name && !errors.email && !errors.message && !errors.location && !errors.privacy;

  return hasRequiredFields && hasLocationIfRequired && hasNoErrors;
};
