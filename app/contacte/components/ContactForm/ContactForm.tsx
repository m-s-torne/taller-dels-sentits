"use client"
import { useContactForm } from '@/app/contacte/hooks';
import { BasicInformation } from './BasicInformation';
import { ServiceTypeSelector } from './ServiceTypeSelector';
import { ServiceSpecificFields } from './ServiceSpecificFields';
import { SubmitButton } from './SubmitButton';
import { PrivacyPolicy } from './PrivacyPolicy';
import { ContactPreferences } from './ContactPreferences';
import { MessageField } from './MessageField';

export const ContactForm = () => {
  const { formData, status, errors, updateField, handleSubmit, isFormValid } = useContactForm();

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Basic Information Section */}
      <BasicInformation formData={formData} updateField={updateField} errors={errors} />

      {/* 🍯 Honeypot Field - Anti-bot trap */}
      {/* This field is hidden from humans but visible to bots */}
      {/* If filled, the form will be rejected on the server */}
      <input
        type="text"
        name="website"
        value={formData.website || ''}
        onChange={(e) => updateField('website', e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Service Type Selection */}
      <ServiceTypeSelector
        formData={formData} 
        updateField={updateField}
      />

      {/* Service-Specific Conditional Fields */}
      <ServiceSpecificFields formData={formData} updateField={updateField} />

      {/* Message Field */}
      <MessageField formData={formData} updateField={updateField} errors={errors} />

      {/* Contact Preferences */}
      <ContactPreferences formData={formData} updateField={updateField} />

      {/* Privacy Policy */}
      <PrivacyPolicy formData={formData} updateField={updateField} errors={errors} />

      {/* Submit Button */}
      <SubmitButton status={status} isFormValid={isFormValid()} />
    </form>
  );
};
