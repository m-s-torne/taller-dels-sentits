export type ServiceType = 'artterapia' | 'artperdins' | 'centres-educatius' | 'general';

export type ArttherapyFormat = 'individual' | 'grupal' | 'unsure';
export type PreferredTime = 'morning' | 'afternoon' | 'weekend' | 'flexible';
export type ParticipantAge = 'adolescent' | 'young-adult' | 'adult';
export type EducationStage = 'infantil' | 'primaria' | 'eso' | 'batxillerat';
export type StudentsCount = '<15' | '15-25' | '25-40' | '40+';
export type ContactPreference = 'email' | 'phone' | 'whatsapp';
export type Availability = 'morning' | 'afternoon' | 'anytime';

export interface ContactFormData {
  // Información básica
  name: string;
  email: string;
  phone: string;
  location: string;
  
  // Tipo de servicio
  serviceType: ServiceType;
  
  // Artteràpia
  arttherapyFormat: ArttherapyFormat | '';
  preferredTime: PreferredTime | '';
  
  // Artperdins
  participantAge: ParticipantAge | '';
  
  // Centres Educatius
  schoolName: string;
  educationStage: EducationStage | '';
  studentsCount: StudentsCount | '';
  studentsAge: string;
  courseGroup: string;
  
  // Común
  message: string;
  contactPreference: ContactPreference[];
  availability: Availability | '';
  
  // RGPD
  privacyAccepted: boolean;
  
  // 🍯 Honeypot field (anti-bot)
  // This field should ALWAYS be empty if filled by a human
  // Bots will fill it automatically, allowing us to detect them
  website?: string;
}

export type FormStatus = 'idle' | 'sending' | 'success' | 'error';

/**
 * Form validation errors
 */
export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  privacy?: string;
}
