import type { ContactFormData, FormErrors } from '@/app/contacte/types';

interface BasicInformationProps {
  formData: ContactFormData;
  errors: FormErrors;
  updateField: <K extends keyof ContactFormData>(
    field: K,
    value: ContactFormData[K]
  ) => void;
}

export const BasicInformation = ({ formData, updateField, errors }: BasicInformationProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Informació de Contacte</h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nom complet *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="El teu nom"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Correu electrònic *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="correu@exemple.cat"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

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

      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          Ubicació
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => updateField('location', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
          placeholder="Ciutat o zona"
        />
      </div>
    </div>
  );
};
