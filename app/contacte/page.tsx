"use client"
import { useRef } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useContactForm } from './hooks/useContactForm';
import { siteConfig } from '@/app/_lib/siteConfig';
import { BasicInformation } from './components/BasicInformation';
import { ServiceTypeSelector } from './components/ServiceTypeSelector';
import { ServiceSpecificFields } from './components/ServiceSpecificFields';
import { MessageField } from './components/MessageField';
import { ContactPreferences } from './components/ContactPreferences';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { SubmitButton } from './components/SubmitButton';

const Contact = () => {
    const {
        formData,
        status,
        errors,
        updateField,
        handleSubmit,
        isFormValid,
        markFieldAsTouched,
        setTurnstileToken,
    } = useContactForm();

    const turnstileRef = useRef<TurnstileInstance | null>(null);

    // When the form is reset (success / honeypot silent-success) or when a
    // submission fails, clear the widget so the next submission gets a
    // fresh, unconsumed token.
    const handleFormSubmitWrapped = async (e: React.FormEvent<HTMLFormElement>) => {
        await handleSubmit(e);
        // The handleSubmit flow clears formData.turnstileToken on error/reset.
        // Force the widget to re-challenge so it emits a new token.
        turnstileRef.current?.reset();
    };

    return (
        <main className="bg-lilac">
            <form onSubmit={handleFormSubmitWrapped} className="max-w-2xl mx-auto pt-25 p-6 space-y-6">
                {/* Basic Information Section */}
                <BasicInformation formData={formData} updateField={updateField} errors={errors} markFieldAsTouched={markFieldAsTouched} />

                {/* Honeypot Field - Anti-bot trap */}
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
                <ServiceSpecificFields formData={formData} updateField={updateField} errors={errors} />

                {/* Message Field */}
                <MessageField formData={formData} updateField={updateField} errors={errors} />

                {/* Contact Preferences */}
                <ContactPreferences formData={formData} updateField={updateField} />

                {/* Privacy Policy */}
                <PrivacyPolicy formData={formData} updateField={updateField} errors={errors} />

                {/* Cloudflare Turnstile (invisible / managed) */}
                <Turnstile
                    ref={turnstileRef}
                    siteKey={siteConfig.turnstileSiteKey}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken('')}
                    onExpire={() => {
                        setTurnstileToken('');
                        turnstileRef.current?.reset();
                    }}
                    options={{
                        theme: 'light',
                        size: 'invisible',
                        action: 'contact_form',
                        refreshExpired: 'auto',
                    }}
                />

                {/* Submit Button */}
                <SubmitButton status={status} isFormValid={isFormValid()} />
            </form>
        </main>
    );
};

export default Contact;
