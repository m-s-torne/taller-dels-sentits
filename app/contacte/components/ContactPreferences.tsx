import type { ContactFormData, ContactPreference, Availability } from '@/app/contacte/types/form.types';
import { contactPreferenceOptions, availabilityOptions } from '@/app/contacte/lib';

interface ContactPreferencesProps {
  formData: ContactFormData;
  updateField: <K extends keyof ContactFormData>(
    field: K,
    value: ContactFormData[K]
  ) => void;
}

export const ContactPreferences = ({ formData, updateField }: ContactPreferencesProps) => {
  const isCentresEducatius = formData.serviceType === 'centres-educatius';

  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-xl font-semibold">Preferències de Contacte</h3>
      
      {!isCentresEducatius && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Com prefereixes que et contactem? (selecciona totes les que apliquin)
          </label>
          <div className="space-y-2">
            {contactPreferenceOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={formData.contactPreference.includes(option.value as ContactPreference)}
                  onChange={(e) => {
                    const newPreferences = e.target.checked
                      ? [...formData.contactPreference, option.value as ContactPreference]
                      : formData.contactPreference.filter((p) => p !== option.value);
                    updateField('contactPreference', newPreferences);
                  }}
                  className="text-shakespeare focus:ring-shakespeare rounded"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          Disponibilitat horària
        </label>
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="availability"
                value={option.value}
                checked={formData.availability === option.value}
                onChange={(e) => updateField('availability', e.target.value as Availability)}
                className="text-shakespeare focus:ring-shakespeare"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
