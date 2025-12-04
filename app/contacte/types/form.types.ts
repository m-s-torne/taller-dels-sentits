export type ServiceType = 'artterapia' | 'artperdins' | 'centres-educatius' | 'general';

export type ArttherapyFormat = 'individual' | 'grupal' | 'unsure';
export type PreferredTime = 'morning' | 'afternoon' | 'weekend' | 'flexible';
export type ParticipantAge = 'adolescent' | 'young-adult' | 'adult';
export type EducationStage = 'infantil' | 'primaria' | 'eso' | 'batxillerat';
export type StudentsCount = '<15' | '15-25' | '25-40' | '40+';
export type ContactPreference = 'email' | 'phone' | 'whatsapp';
export type Availability = 'morning' | 'afternoon' | 'anytime';

// Cursos específicos por etapa educativa
export type InfantilCourse = 'I3' | 'I4' | 'I5';
export type PrimariaCourse = '1r' | '2n' | '3r' | '4t' | '5è' | '6è';
export type ESOCourse = '1r ESO' | '2n ESO' | '3r ESO' | '4t ESO';
export type BatxilleratCourse = '1r Batxillerat' | '2n Batxillerat';
export type CourseGroup = InfantilCourse | PrimariaCourse | ESOCourse | BatxilleratCourse;

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
  courseGroup: CourseGroup | '';
  
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
  artperdins?: string;
  artterapia?: {
    session?: boolean;
    time?: boolean;
  };
  centres: {
    
  };
}
