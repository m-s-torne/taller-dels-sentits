import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import type { ContactFormData, FormStatus, FormErrors } from '@/app/contacte/types';
import { validateAndSanitize } from '@/app/contacte/actions/handleSubmit';
import { sendEmail } from '@/app/contacte/actions/sendEmail';

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
  preferredTime: '',

  // Artperdins specific fields
  participantAge: '',

  // School specific fields
  schoolName: '',
  educationStage: '',
  studentsCount: '',
  courseGroup: '',

  // Optional fields
  contactPreference: [],
  availability: '',
  
  // Honeypot field (anti-bot)
  website: '',
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
   * Validates email format
   */
  const validateEmail = (email: string): string | undefined => {
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
  const validateName = (name: string): string | undefined => {
    if (!name) return undefined; // No error if empty
    
    if (name.length < 3) {
      return 'El nom ha de tenir almenys 3 caràcters';
    }
    return undefined;
  };

  /**
   * Validates message field
   */
  const validateMessage = (message: string): string | undefined => {
    if (!message) return undefined; // No error if empty
    
    if (message.length < 10) {
      return 'El missatge ha de tenir almenys 10 caràcters';
    }
    return undefined;
  };

  /**
   * Validates studentsCount field (for centres-educatius)
   */
  const validateStudentsCount = (count: number | ''): string | undefined => {
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
  const validateLocation = (location: string, serviceType: string, isTouched: boolean = false): string | undefined => {
    if (serviceType === 'centres-educatius' && !location.trim() && isTouched) {
      return 'La població és obligatòria per a centres educatius';
    }
    return undefined;
  };

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

      // Validate field in real-time
      let error: string | undefined;
      
      if (field === 'email') {
        error = validateEmail(value as string);
      } else if (field === 'name') {
        error = validateName(value as string);
      } else if (field === 'message') {
        error = validateMessage(value as string);
      } else if (field === 'studentsCount') {
        error = validateStudentsCount(value as number | '');
      } else if (field === 'location') {
        error = validateLocation(value as string, newData.serviceType, touchedFields.has('location'));
      }

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
          newData.preferredTime = '';
          newData.participantAge = '';
        }
        
        // Clear centres-educatius specific fields when switching to other services
        if (value !== 'centres-educatius') {
          newData.schoolName = '';
          newData.educationStage = '';
          newData.studentsCount = '';
          newData.courseGroup = '';
        }

        // Clear arttherapy fields when switching away
        if (value !== 'artterapia') {
          newData.arttherapyFormat = '';
          newData.preferredTime = '';
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
    const newErrors: FormErrors = {} as FormErrors;

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Checks if form is valid (for submit button state)
   */
  const isFormValid = (): boolean => {
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
      // STEP 1: Validate and sanitize on server (Server Action)
      // This cannot be bypassed by malicious clients
      const validation = await validateAndSanitize(formData);

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

      // STEP 2: Send email from client with sanitized data
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
