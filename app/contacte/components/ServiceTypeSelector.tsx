import type { ContactFormData, ServiceType } from '@/app/contacte/types/form.types';
import { serviceIcons } from '@/app/contacte/lib';
import { getServiceLabels } from '@/app/contacte/actions';

interface ServiceTypeSelectorProps {
  formData: ContactFormData;
  updateField: <K extends keyof ContactFormData>(
    field: K,
    value: ContactFormData[K]
  ) => void;
}

export const ServiceTypeSelector = ({ 
  formData, 
  updateField,
}: ServiceTypeSelectorProps) => {
  const serviceLabels = getServiceLabels();
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Tipus de Servei</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(serviceLabels) as ServiceType[]).map((service) => (
          <button
            key={service}
            type="button"
            onClick={() => updateField('serviceType', service)}
            className={`p-4 border-2 rounded-lg transition-all flex items-center gap-3 ${
              serviceIcons[service] ? '' : 'justify-center'
            } ${
              formData.serviceType === service
                ? 'border-shakespeare bg-shakespeare/10 font-semibold'
                : 'border-gray-300 hover:border-shakespeare/50'
            }`}
          >
            {serviceIcons[service] && (
              <img
                src={serviceIcons[service]!} 
                alt={serviceLabels[service]}
                className="w-20 h-20 object-contain"
              />
            )}
            <span>{serviceLabels[service]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
