import type { ContactFormData, FormErrors } from '@/app/contacte/types';

interface PrivacyPolicyProps {
  formData: ContactFormData;
  errors: FormErrors;
  updateField: <K extends keyof ContactFormData>(
    field: K,
    value: ContactFormData[K]
  ) => void;
}

export const PrivacyPolicy = ({ formData, updateField, errors }: PrivacyPolicyProps) => {
  return (
    <div className="border-t pt-6">
      <label className="flex items-start space-x-3">
        <input
          type="checkbox"
          required
          checked={formData.privacyAccepted}
          onChange={(e) => updateField('privacyAccepted', e.target.checked)}
          className="mt-1 text-shakespeare focus:ring-shakespeare rounded"
        />
        <span className="text-sm">
          Accepto la{' '}
          <a href="/politica-privacitat" className="text-shakespeare! hover:underline">
            política de privacitat
          </a>{' '}
          i dono el meu consentiment per al tractament de les meves dades personals segons el RGPD. *
        </span>
      </label>
      {errors.privacy && (
        <p className="text-red-500 text-sm mt-2">{errors.privacy}</p>
      )}
    </div>
  );
};
