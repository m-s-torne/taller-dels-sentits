import type { CentreSubtype, EntityType, ExternsSubtype } from '@/app/contacte/types/form.types';

/**
 * Get Catalan label for centre subtype (alumnes/professorat)
 */
export const getCentreSubtypeLabel = (subtype: CentreSubtype): string => {
  const labels: Record<CentreSubtype, string> = {
    'alumnes': 'Alumnes',
    'professorat': 'Professorat',
  };
  return labels[subtype] || subtype;
};

/**
 * Get Catalan label for entity type
 */
export const getEntityTypeLabel = (entityType: EntityType): string => {
  const labels: Record<EntityType, string> = {
    'ajuntament': 'Ajuntament',
    'hospital': 'Hospital',
    'residencia': 'Residència',
    'centre-cultural': 'Centre cultural',
    'col-lectiu-empresa': 'Col·lectiu/Empresa',
    'entitat-social': 'Entitat social',
    'altres': 'Altres',
  };
  return labels[entityType] || entityType;
};

/**
 * Get detailed service description for emails
 * Shows the exact type of centre for external services
 */
export const getServiceDescription = (
  serviceType: string,
  externsSubtype?: ExternsSubtype,
  centreSubtype?: CentreSubtype,
  entityType?: EntityType,
  entityName?: string
): string => {
  if (serviceType === 'serveis-externs') {
    if (externsSubtype === 'centre-educatiu' && centreSubtype) {
      return `Serveis Externs - Centre Educatiu (${getCentreSubtypeLabel(centreSubtype)})`;
    }
    if (externsSubtype === 'altres-entitats' && entityType) {
      const label = getEntityTypeLabel(entityType);
      if (entityName) {
        return `Serveis Externs - ${label}: ${entityName}`;
      }
      return `Serveis Externs - ${label}`;
    }
  }
  return serviceType;
};
