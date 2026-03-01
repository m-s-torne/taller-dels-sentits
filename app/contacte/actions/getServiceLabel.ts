import type { ServiceType } from '@/app/contacte/types/form.types';

/**
 * Returns labels for all service types
 */
export const getServiceLabels = (): Record<ServiceType, string> => {
  return {
    'artterapia': 'Artteràpia',
    'artperdins': 'Artperdins',
    'serveis-externs': 'Serveis Externs',
    'general': 'Consulta General'
  };
};

/**
 * Returns label for a specific service type
 */
export const getServiceLabel = (type: ServiceType): string => {
  const labels = getServiceLabels();
  return labels[type];
};
