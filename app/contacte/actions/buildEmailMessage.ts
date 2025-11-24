"use server"
import type { ContactFormData } from '@/app/contacte/types';

export const buildEmailMessage = async (data: ContactFormData): Promise<string> => {
  let msg = data.message + '\n\n--- DETALLS DE LA CONSULTA ---\n\n';
  
  // Información básica
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
  
  msg += '\n--- DETALLS DEL SERVEI ---\n\n';
  
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
    
    if (data.preferredTime) {
      const timeLabels = {
        morning: 'Matins',
        afternoon: 'Tardes',
        weekend: 'Cap de setmana',
        flexible: 'Flexible'
      };
      msg += `Franja horària preferida: ${timeLabels[data.preferredTime]}\n`;
    }
  }
  
  // Artperdins
  if (data.serviceType === 'artperdins') {
    msg += '🌸 ARTPERDINS\n';
    
    if (data.participantAge) {
      const ageLabels = {
        adolescent: 'Adolescent (12-17 anys)',
        'young-adult': 'Jove adult (18-30 anys)',
        adult: 'Adult (30+ anys)'
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
    
    if (data.studentsCount) {
      msg += `Nombre aproximat d'alumnes: ${data.studentsCount}\n`;
    }
    
    if (data.studentsAge) {
      msg += `Edat dels alumnes: ${data.studentsAge}\n`;
    }
    
    if (data.courseGroup) {
      msg += `Curs/Grup: ${data.courseGroup}\n`;
    }
  }
  
  return msg;
};
