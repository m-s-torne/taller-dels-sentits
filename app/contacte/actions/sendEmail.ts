"use client"
import emailjs from '@emailjs/browser';
import type { ContactFormData, ServiceType } from '@/app/contacte/types';
import { buildEmailMessage } from './buildEmailMessage';
import { getServiceLabel } from './getServiceLabel';

/**
 * Determines which EmailJS configuration to use based on service type
 * - centres-educatius: Uses dedicated school service
 * - artterapia, artperdins, general: Uses general service
 */
const getEmailJSConfig = (serviceType: ServiceType) => {
  const isSchool = serviceType === 'centres-educatius';
  
  return {
    serviceId: isSchool 
      ? process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID_SCHOOL
      : process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateId: isSchool
      ? process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_SCHOOL
      : process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    publicKey: isSchool
      ? process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_SCHOOL
      : process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  };
};

/**
 * Sends email using EmailJS from the client side
 * This function should ONLY be called with sanitized data from validateAndSanitize
 * 
 * SECURITY NOTE: This runs in the browser, so EmailJS credentials are public.
 * Security is maintained by:
 * 1. Server-side validation/sanitization before calling this
 * 2. Domain restrictions in EmailJS dashboard
 * 3. Rate limiting in EmailJS dashboard
 * 4. Honeypot field validation on server
 * 
 * @param sanitizedData - Already validated and sanitized form data
 * @returns Promise resolving to success/error status
 */
export const sendEmail = async (
  sanitizedData: ContactFormData
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get EmailJS credentials from public environment variables
    // These are safe to expose because EmailJS is designed for client-side use
    // Uses different credentials for school vs general services
    const { serviceId, templateId, publicKey } = getEmailJSConfig(sanitizedData.serviceType);
    const serviceLabel = getServiceLabel(sanitizedData.serviceType) as ServiceType;

    // Validate environment variables are present
    if (!serviceId || !templateId || !publicKey) {
      console.error('Missing EmailJS credentials for service:', sanitizedData.serviceType);
      return { 
        success: false, 
        error: 'Configuració incorrecta. Contacta amb l\'administrador.' 
      };
    }

    // Build email message from sanitized data
    // buildEmailMessage is a Server Action, so we need to await it
    const message = await buildEmailMessage(sanitizedData);

    // Prepare template parameters for EmailJS
    const templateParams = {
      from_name: sanitizedData.name,
      from_email: sanitizedData.email,
      from_phone: sanitizedData.phone || 'No proporcionat',
      from_service: serviceLabel,
      message: message,
      reply_to: sanitizedData.email,
    };

    // Send email using EmailJS browser SDK
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    if (response.status === 200) {
      return { success: true };
    } else {
      throw new Error('Email sending failed with status: ' + response.status);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Return user-friendly error without exposing internal details
    return { 
      success: false, 
      error: 'Error al enviar el missatge. Si us plau, torna-ho a intentar.' 
    };
  }
};
