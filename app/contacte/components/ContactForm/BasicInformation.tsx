import type { ContactFormData, FormErrors } from '@/app/contacte/types';

interface BasicInformationProps {
  formData: ContactFormData;
  errors: FormErrors;
  updateField: <K extends keyof ContactFormData>(
    field: K,
    value: ContactFormData[K]
  ) => void;
  markFieldAsTouched: (field: keyof ContactFormData) => void;
}

export const BasicInformation = ({ formData, updateField, errors, markFieldAsTouched }: BasicInformationProps) => {
  const isCentresEducatius = formData.serviceType === 'centres-educatius';
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Informació de Contacte</h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nom complet <span className="text-red-500!">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${
            errors.name ? 'border-red-500! focus:ring-red-500!' : 'border-gray-300'
          }`}
          placeholder="El teu nom"
        />
        {errors.name && (
          <p className="text-red-500! text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Correu electrònic <span className="text-red-500!">*</span>
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${
            errors.email ? 'border-red-500! focus:ring-red-500!' : 'border-gray-300'
          }`}
          placeholder="correu@exemple.cat"
        />
        {errors.email && (
          <p className="text-red-500! text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {!isCentresEducatius && (
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Telèfon
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
            placeholder="+34 600 000 000"
          />
        </div>
      )}

      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          {isCentresEducatius ? <>Població <span className="text-red-500!">*</span></> : 'Ubicació'}
        </label>
        <input
          type="text"
          id="location"
          required={isCentresEducatius}
          value={formData.location}
          onChange={(e) => updateField('location', e.target.value)}
          onBlur={() => markFieldAsTouched('location')}
          className={`w-full px-4 py-2 border! rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${
            errors.location ? 'border-red-500! focus:ring-red-500!' : 'border-gray-300!'
          }`}
          placeholder={isCentresEducatius ? "Població del centre" : "Ciutat o zona"}
        />
        {errors.location && (
          <p className="text-red-500! text-sm! mt-1">{errors.location}</p>
        )}
      </div>
    </div>
  );
};
