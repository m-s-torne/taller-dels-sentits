import Link from 'next/link';
import type { ContactFormData, FormErrors } from '@/app/contacte/types';
import { privacyData } from '@/app/privacitat/lib/privacyData';

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
    <div className="border-t pt-6 space-y-4">
      {/* Resumen informativo */}
      <div className="bg-violet-blue/10 p-4 rounded-lg">
        <p className="text-sm text-midnight">
          ℹ️ {privacyData.shortSummary}
        </p>
      </div>

      {/* Checkbox de aceptación */}
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
          <Link 
            href="/privacitat" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-shakespeare! hover:text-violet-blue! underline font-medium transition-colors"
          >
            política de privacitat
          </Link>{' '}
          i dono el meu consentiment explícit per al tractament de les meves dades personals segons el RGPD. *
        </span>
      </label>
      {errors.privacy && (
        <p className="text-red-500 text-sm mt-2">{errors.privacy}</p>
      )}
    </div>
  );
};
