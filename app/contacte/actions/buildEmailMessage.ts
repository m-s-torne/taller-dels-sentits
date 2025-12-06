"use server"
import type { ContactFormData } from '@/app/contacte/types';

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
  
  // Centres Educatius
  if (data.serviceType === 'centres-educatius') {
    msg += '🏫 CENTRES EDUCATIUS\n';
    
    if (data.schoolName) {
      msg += `Nom del centre: ${data.schoolName}\n`;
    }
    
    if (data.educationStage) {
      const stageLabels = {
        infantil: 'Infantil',
        primaria: 'Primària',
        eso: 'ESO',
        batxillerat: 'Batxillerat'
      };
      msg += `Etapa educativa: ${stageLabels[data.educationStage]}\n`;
    }
    
    if (data.courseGroup) {
      msg += `Curs: ${data.courseGroup}\n`;
    }
    
    if (data.studentsCount) {
      msg += `Nombre aproximat d'alumnes: ${data.studentsCount}\n`;
    }
    
    if (data.courseInterest) {
      msg += `Curs/Monogràfic d'interès: ${data.courseInterest}\n`;
    }
  }
  
  return msg;
};
