"use client"
import { useContactForm } from './hooks/useContactForm';
import { BasicInformation } from './components/BasicInformation';
import { ServiceTypeSelector } from './components/ServiceTypeSelector';
import { ServiceSpecificFields } from './components/ServiceSpecificFields';
import { MessageField } from './components/MessageField';
import { ContactPreferences } from './components/ContactPreferences';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { SubmitButton } from './components/SubmitButton';

const Contact = () => {
    const { formData, status, errors, updateField, handleSubmit, isFormValid, markFieldAsTouched } = useContactForm();
    
    return (
        <main className="bg-lilac">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto pt-25 p-6 space-y-6">
                {/* Basic Information Section */}
                <BasicInformation formData={formData} updateField={updateField} errors={errors} markFieldAsTouched={markFieldAsTouched} />
        
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
        </main>
    )
}

export default Contact;