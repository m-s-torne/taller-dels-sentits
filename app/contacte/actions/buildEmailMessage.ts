"use server"
import type { ContactFormData } from '@/app/contacte/types/form.types';

export const buildEmailMessage = async (data: ContactFormData): Promise<string> => {
  let msg = data.message + '\n\n--- DETALLS DE LA CONSULTA ---\n\n';
  
  // Información básica
  if (data.phone) {
    msg += `📱 Telèfon: ${data.phone}\n`;
  }

  msg += `📧 Email: ${data.email}\n`;
  
  if (data.location) {
    msg += `📍 Població: ${data.location}\n`;
  }
  
  // Preferencias de contacto
  if (data.contactPreference.length > 0) {
    msg += `📞 Preferència de contacte: ${data.contactPreference.join(', ')}\n`;
  }
  
  if (data.availability) {
    const availabilityLabels = {
      morning: 'Matins (9h-14h)',
      afternoon: 'Tardes (14h-18h)',
      anytime: 'Qualsevol moment'
    };
    msg += `⏰ Disponibilitat: ${availabilityLabels[data.availability]}\n`;
  }
  
  if (data.serviceType !== 'general') {
    msg += '\n--- DETALLS DEL SERVEI ---\n\n';
  }
  
  // Artteràpia
  if (data.serviceType === 'artterapia') {
    msg += '🎨 ARTTERÀPIA\n';
    
    if (data.arttherapyFormat) {
      const formatLabels = {
        individual: 'Sessions individuals',
        grupal: 'Sessions grupals',
        unsure: 'No estic segur/a'
      };
      msg += `Format: ${formatLabels[data.arttherapyFormat]}\n`;
    }
  }
  
  // Artperdins
  if (data.serviceType === 'artperdins') {
    msg += '🌸 ARTPERDINS\n';
    
    if (data.participantAge) {
      const ageLabels = {
        adolescent: 'Adolescents (12-15 anys)',
        'young-adult': 'Joves (15-20 anys)',
        adult: 'Adults (20 anys o més)'
      };
      msg += `Edat del participant: ${ageLabels[data.participantAge]}\n`;
    }
  }
  
  // Serveis Externs
  if (data.serviceType === 'serveis-externs') {
    msg += '🏛️ SERVEIS EXTERNS\n';

    if (data.externsSubtype === 'centre-educatiu') {
      msg += `Tipus: Centre Educatiu\n`;

      if (data.centreSubtype === 'alumnes') {
        msg += `Destinatari: Formació per a alumnes\n`;
        if (data.schoolName) msg += `Nom del centre: ${data.schoolName}\n`;
        if (data.educationStage) {
          const stageLabels: Record<string, string> = {
            infantil: 'Infantil', primaria: 'Primària', eso: 'ESO', batxillerat: 'Batxillerat'
          };
          msg += `Etapa educativa: ${stageLabels[data.educationStage]}\n`;
        }
        if (data.courseGroup) msg += `Curs: ${data.courseGroup}\n`;
        if (data.studentsCount) msg += `Nombre aproximat d'alumnes: ${data.studentsCount}\n`;
        if (data.courseInterest) msg += `Curs/Monogràfic d'interès: ${data.courseInterest}\n`;
      }

      if (data.centreSubtype === 'professorat') {
        msg += `Destinatari: Formació al professorat\n`;
        if (data.schoolName) msg += `Nom del centre: ${data.schoolName}\n`;
        if (data.educationStage) {
          const stageLabels: Record<string, string> = {
            infantil: 'Infantil', primaria: 'Primària', eso: 'ESO', batxillerat: 'Batxillerat'
          };
          msg += `Etapa educativa: ${stageLabels[data.educationStage]}\n`;
        }
        if (data.teachersCount) msg += `Nombre de professors: ${data.teachersCount}\n`;
        if (data.trainingInterest) msg += `Àrea d'interès per a la formació: ${data.trainingInterest}\n`;
      }
    }

    if (data.externsSubtype === 'altres-entitats') {
      msg += `Tipus: Altres entitats\n`;
      if (data.entityType) {
        const entityLabels: Record<string, string> = {
          ajuntament: 'Ajuntament',
          hospital: 'Hospital',
          residencia: 'Residència',
          'centre-cultural': 'Centre Cultural',
          'col-lectiu-empresa': 'Col·lectiu d\'empresa',
          'entitat-social': 'Entitat Social',
          altres: 'Altres'
        };
        msg += `Tipus d'entitat: ${entityLabels[data.entityType]}\n`;
      }
      if (data.entityName) msg += `Nom de l'entitat: ${data.entityName}\n`;
      if (data.entityType === 'altres' && data.entityDescription) {
        msg += `Descripció de l'entitat: ${data.entityDescription}\n`;
      }
      if (data.participantsCount) msg += `Nombre aproximat de participants: ${data.participantsCount}\n`;
      if (data.projectDescription) msg += `Descripció del projecte: ${data.projectDescription}\n`;
    }
  }
  
  return msg;
};
