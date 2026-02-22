import type { ContactFormData, FormErrors } from '@/app/contacte/types/form.types';

interface MessageFieldProps {
  formData: ContactFormData;
  errors: FormErrors;
  updateField: <K extends keyof ContactFormData>(
    field: K,
    value: ContactFormData[K]
  ) => void;
}

export const MessageField = ({ formData, updateField, errors }: MessageFieldProps) => {
  return (
    <div>
      <label htmlFor="message" className="block text-sm font-medium mb-1">
        Missatge *
      </label>
      <textarea
        id="message"
        rows={6}
        required
        value={formData.message}
        onChange={(e) => updateField('message', e.target.value)}
        className={`w-full px-4 py-2 border! rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent resize-none ${
          errors.message ? 'focus:ring-red-500!' : 'border-gray-300!'
        }`}
        placeholder="Explica'ns més sobre la teva consulta o necessitats..."
      />
      {errors.message && (
        <p className="text-red-500! text-sm mt-1">{errors.message}</p>
      )}
    </div>
  );
};
