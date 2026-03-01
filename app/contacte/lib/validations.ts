import type { ContactFormData } from '@/app/contacte/types/form.types';

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
 * Validates studentsCount field (for centre-educatiu / alumnes)
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
 * Validates teachersCount field (for centre-educatiu / professorat)
 */
export const validateTeachersCount = (count: number | ''): string | undefined => {
  if (count === '') return undefined;
  if (typeof count !== 'number' || isNaN(count)) {
    return 'El nombre ha de ser un valor numèric';
  }
  if (count < 1) {
    return 'El nombre de professors ha de ser almenys 1';
  }
  return undefined;
};

/**
 * Validates participantsCount field (for altres-entitats)
 */
export const validateParticipantsCount = (count: number | ''): string | undefined => {
  if (count === '') return undefined;
  if (typeof count !== 'number' || isNaN(count)) {
    return 'El nombre ha de ser un valor numèric';
  }
  if (count < 1) {
    return 'El nombre de participants ha de ser almenys 1';
  }
  return undefined;
};

/**
 * Validates a required string field (non-empty)
 */
const validateRequired = (value: string, errorMsg: string): string | undefined => {
  if (!value?.trim()) return errorMsg;
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
  if (serviceType === 'serveis-externs' && !location.trim() && isTouched) {
    return 'La població és obligatòria per a serveis externs';
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
    case 'teachersCount':
      return validateTeachersCount(value as number | '');
    case 'participantsCount':
      return validateParticipantsCount(value as number | '');
    case 'location':
      return validateLocation(value as string, formData.serviceType, touchedFields.has('location'));
    case 'externsSubtype':
      if (formData.serviceType === 'serveis-externs' && touchedFields.has('externsSubtype'))
        return validateRequired(value as string, 'Has de seleccionar el tipus de col·lectiu');
      return undefined;
    case 'centreSubtype':
      if (
        formData.serviceType === 'serveis-externs' &&
        formData.externsSubtype === 'centre-educatiu' &&
        touchedFields.has('centreSubtype')
      )
        return validateRequired(value as string, 'Has de seleccionar el destinatari de la formació');
      return undefined;
    case 'schoolName':
      if (
        formData.serviceType === 'serveis-externs' &&
        formData.externsSubtype === 'centre-educatiu' &&
        formData.centreSubtype === 'professorat' &&
        touchedFields.has('schoolName')
      )
        return validateRequired(value as string, 'El nom del centre és obligatori');
      return undefined;
    case 'entityType':
      if (
        formData.serviceType === 'serveis-externs' &&
        formData.externsSubtype === 'altres-entitats' &&
        touchedFields.has('entityType')
      )
        return validateRequired(value as string, 'Has de seleccionar el tipus d\'entitat');
      return undefined;
    case 'entityName':
      if (
        formData.serviceType === 'serveis-externs' &&
        formData.externsSubtype === 'altres-entitats' &&
        touchedFields.has('entityName')
      )
        return validateRequired(value as string, 'El nom de l\'entitat és obligatori');
      return undefined;
    case 'participantsCount':
      if (
        formData.serviceType === 'serveis-externs' &&
        formData.externsSubtype === 'altres-entitats' &&
        touchedFields.has('participantsCount')
      ) {
        if (value === '' || value === null || value === undefined)
          return 'El nombre de participants és obligatori';
        return validateParticipantsCount(value as number | '');
      }
      return undefined;
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
): { name?: string; email?: string; message?: string; location?: string; privacy?: string; externsSubtype?: string; centreSubtype?: string; schoolName?: string; entityType?: string; entityName?: string; participantsCount?: string } => {
  const newErrors: { name?: string; email?: string; message?: string; location?: string; privacy?: string; externsSubtype?: string; centreSubtype?: string; schoolName?: string; entityType?: string; entityName?: string; participantsCount?: string } = {};

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

  // Serveis Externs specific required fields
  if (formData.serviceType === 'serveis-externs') {
    // location always required
    const locationError = validateLocation(formData.location, formData.serviceType, true);
    if (locationError) newErrors.location = locationError;

    // externsSubtype required
    if (!formData.externsSubtype) {
      newErrors.externsSubtype = 'Has de seleccionar el tipus de col·lectiu';
    }

    if (formData.externsSubtype === 'centre-educatiu') {
      if (!formData.centreSubtype) {
        newErrors.centreSubtype = 'Has de seleccionar el destinatari de la formació';
      }
      if (formData.centreSubtype === 'professorat' && !formData.schoolName?.trim()) {
        newErrors.schoolName = 'El nom del centre és obligatori';
      }
    }

    if (formData.externsSubtype === 'altres-entitats') {
      if (!formData.entityType) {
        newErrors.entityType = 'Has de seleccionar el tipus d\'entitat';
      }
      if (!formData.entityName?.trim()) {
        newErrors.entityName = 'El nom de l\'entitat és obligatori';
      }
      if (formData.participantsCount === '' || formData.participantsCount === null || formData.participantsCount === undefined) {
        newErrors.participantsCount = 'El nombre de participants és obligatori';
      }
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
  errors: { name?: string; email?: string; message?: string; location?: string; privacy?: string; externsSubtype?: string; centreSubtype?: string; schoolName?: string; entityType?: string; entityName?: string; participantsCount?: string }
): boolean => {
  // Required fields must be filled
  const hasRequiredFields = !!(
    formData.name &&
    formData.email &&
    formData.message &&
    formData.privacyAccepted
  );

  // For serveis-externs, location + subtype required fields
  let hasServeisExternsFields = true;
  if (formData.serviceType === 'serveis-externs') {
    if (!formData.location?.trim()) hasServeisExternsFields = false;
    if (!formData.externsSubtype) hasServeisExternsFields = false;
    if (formData.externsSubtype === 'centre-educatiu' && !formData.centreSubtype) hasServeisExternsFields = false;
    if (
      formData.externsSubtype === 'centre-educatiu' &&
      formData.centreSubtype === 'professorat' &&
      !formData.schoolName?.trim()
    ) hasServeisExternsFields = false;
    if (formData.externsSubtype === 'altres-entitats' && !formData.entityType) hasServeisExternsFields = false;
    if (formData.externsSubtype === 'altres-entitats' && !formData.entityName?.trim()) hasServeisExternsFields = false;
    if (formData.externsSubtype === 'altres-entitats' && (formData.participantsCount === '' || formData.participantsCount === null || formData.participantsCount === undefined)) hasServeisExternsFields = false;
  }

  // Check all error fields
  const hasNoErrors = !errors.name && !errors.email && !errors.message && !errors.location &&
    !errors.privacy && !errors.externsSubtype && !errors.centreSubtype &&
    !errors.schoolName && !errors.entityType && !errors.entityName && !errors.participantsCount;

  return hasRequiredFields && hasServeisExternsFields && hasNoErrors;
};
