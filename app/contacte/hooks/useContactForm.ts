import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import type { ContactFormData, FormStatus, FormErrors } from '@/app/contacte/types';
import { validateAndSanitize } from '@/app/contacte/actions/handleSubmit';
import { sendEmail } from '@/app/contacte/actions/sendEmail';
import {
  validateLocation,
  validateField,
  validateCompleteForm,
  isFormValid as checkFormValidity,
} from '@/app/contacte/lib/validations';

/**
 * Initial empty form data
 */
const initialFormData: ContactFormData = {
  // Basic fields (always visible)
  name: '',
  email: '',
  phone: '',
  location: '',
  serviceType: 'general',
  message: '',
  privacyAccepted: false,

  // Arttherapy specific fields
  arttherapyFormat: '',

  // Artperdins specific fields
  participantAge: '',

  // School specific fields
  schoolName: '',
  educationStage: '',
  studentsCount: '',
  courseGroup: '',
  courseInterest: '',

  // Optional fields
  contactPreference: [],
  availability: '',
  
  // Honeypot field (anti-bot)
  website: 'TEST_BOT',
};

const initialErrorsData: FormErrors = {
  name: '',
  email: '',
  message: '',
  privacy: '',
  location: '',
  artperdins: '',
  artterapia: {
    session: false,
    time: false,
  },
  centres: {},
}

/**
 * Custom hook for managing contact form state and submission
 */
export const useContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<FormErrors>(initialErrorsData);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  /**
   * Updates a specific form field with real-time validation
   */
  const updateField = <K extends keyof ContactFormData>(
    field: K,
    value: ContactFormData[K]
  ) => {
    // Update field value
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Validate field in real-time using centralized validation
      const error = validateField(field, value, newData, touchedFields);

      // Update errors state
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: error,
      }));

      // If serviceType changes, revalidate location only if it was touched
      if (field === 'serviceType') {
        const locationError = validateLocation(newData.location, value as string, touchedFields.has('location'));
        setErrors((prevErrors) => ({
          ...prevErrors,
          location: locationError,
        }));

        // Clear fields that don't apply to centres-educatius
        if (value === 'centres-educatius') {
          newData.phone = '';
          newData.contactPreference = []; // Clear contact preferences (phone, whatsapp, etc.)
          newData.arttherapyFormat = '';
          newData.participantAge = '';
        }
        
        // Clear centres-educatius specific fields when switching to other services
        if (value !== 'centres-educatius') {
          newData.schoolName = '';
          newData.educationStage = '';
          newData.studentsCount = '';
          newData.courseGroup = '';
          newData.courseInterest = '';
        }

        // Clear arttherapy fields when switching away
        if (value !== 'artterapia') {
          newData.arttherapyFormat = '';
        }

        // Clear artperdins fields when switching away
        if (value !== 'artperdins') {
          newData.participantAge = '';
        }
      }

      return newData;
    });
  };

  /**
   * Marks a field as touched (user has interacted with it)
   */
  const markFieldAsTouched = (field: keyof ContactFormData) => {
    setTouchedFields((prev) => new Set(prev).add(field));
    
    // Revalidate the field after marking it as touched
    if (field === 'location') {
      const locationError = validateLocation(formData.location, formData.serviceType, true);
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: locationError,
      }));
    }
  };

  /**
   * Resets form to initial state
   */
  const resetForm = () => {
    setFormData(initialFormData);
    setStatus('idle');
    setErrors(initialErrorsData);
    setTouchedFields(new Set());
  };

  /**
   * Validates complete form before submission
   */
  const validateForm = (): boolean => {
    const newErrors = validateCompleteForm(formData);
    setErrors(newErrors as FormErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Checks if form is valid (for submit button state)
   */
  const isFormValid = (): boolean => {
    return checkFormValidity(formData, errors);
  };

  /**
   * Handles form submission with two-step security process:
   * 1. Server-side validation and sanitization (Server Action)
   * 2. Client-side email sending with sanitized data
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all required fields as touched to show validation errors
    const requiredFields: (keyof ContactFormData)[] = ['name', 'email', 'message'];
    if (formData.serviceType === 'centres-educatius') {
      requiredFields.push('location');
    }
    
    requiredFields.forEach(field => {
      setTouchedFields((prev) => new Set(prev).add(field));
    });

    // Client-side validation for UX (quick feedback)
    if (!validateForm()) {
      toast.error('Si us plau, revisa els camps marcats en vermell.');
      return;
    }

    setStatus('sending');
    const loadingToast = toast.loading('Enviant el teu missatge...');

    try {
      // STEP 1: Execute reCAPTCHA Enterprise (client-side)
      // This generates a token that proves the user interacted with the form
      let recaptchaToken: string;
      try {
        // Wait for grecaptcha enterprise to be available
        if (typeof window.grecaptcha === 'undefined' || !window.grecaptcha.enterprise) {
          throw new Error('reCAPTCHA Enterprise not loaded');
        }

        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (!siteKey) {
          throw new Error('reCAPTCHA site key not configured');
        }

        // Execute reCAPTCHA Enterprise with custom action
        recaptchaToken = await window.grecaptcha.enterprise.execute(siteKey, { 
          action: 'SUBMIT_CONTACT_FORM' 
        });
        
        console.log('✅ reCAPTCHA token generated');
      } catch (recaptchaError) {
        console.error('❌ reCAPTCHA execution error:', recaptchaError);
        toast.dismiss(loadingToast);
        toast.error('Error de verificació de seguretat. Si us plau, recarrega la pàgina i torna-ho a intentar.');
        setStatus('error');
        return;
      }

      // STEP 2: Validate and sanitize on server (Server Action)
      // This includes reCAPTCHA token verification
      // This cannot be bypassed by malicious clients
      const validation = await validateAndSanitize({
        ...formData,
        recaptchaToken
      });

      // Check for honeypot detection
      if (!validation.valid && validation.error === 'invalid_honeypot') {
        // Bot detected - pretend success to avoid revealing the trap
        toast.dismiss(loadingToast);
        toast.success('Missatge enviat correctament! Et respondrem aviat.', {
          duration: 5000,
        });
        setStatus('success');
        setTimeout(() => resetForm(), 2000);
        return;
      }

      // Check for validation errors
      if (!validation.valid) {
        toast.dismiss(loadingToast);
        toast.error(validation.error || 'Error de validació', {
          duration: 6000,
        });
        setStatus('error');
        return;
      }

      // STEP 3: Send email from client with sanitized data
      // Data is already validated and sanitized by the server
      const result = await sendEmail(validation.data!);

      toast.dismiss(loadingToast);

      if (result.success) {
        setStatus('success');
        toast.success('Missatge enviat correctament! Et respondrem aviat.', {
          duration: 5000,
        });
        
        // Reset form after 2 seconds
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        setStatus('error');
        toast.error(result.error || 'Error en enviar el missatge. Si us plau, torna-ho a intentar.', {
          duration: 6000,
        });
        console.error('Form submission error:', result.error);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      setStatus('error');
      toast.error('Error inesperat. Si us plau, torna-ho a intentar més tard.', {
        duration: 6000,
      });
      console.error('Unexpected error during form submission:', error);
    }
  };

  return {
    formData,
    status,
    errors,
    updateField,
    handleSubmit,
    resetForm,
    isFormValid,
    markFieldAsTouched,
  };
};
