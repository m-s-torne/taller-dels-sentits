export type ServiceType = 'artterapia' | 'artperdins' | 'serveis-externs' | 'general';

export type ArttherapyFormat = 'individual' | 'grupal' | 'unsure';
export type ParticipantAge = 'adolescent' | 'young-adult' | 'adult';
export type EducationStage = 'infantil' | 'primaria' | 'eso' | 'batxillerat';
export type ContactPreference = 'email' | 'phone' | 'whatsapp';
export type Availability = 'morning' | 'afternoon' | 'anytime';

// Cursos específicos por etapa educativa
export type InfantilCourse = 'I3' | 'I4' | 'I5';
export type PrimariaCourse = '1r' | '2n' | '3r' | '4t' | '5è' | '6è';
export type ESOCourse = '1r ESO' | '2n ESO' | '3r ESO' | '4t ESO';
export type BatxilleratCourse = '1r Batxillerat' | '2n Batxillerat';
export type CourseGroup = InfantilCourse | PrimariaCourse | ESOCourse | BatxilleratCourse;

// Serveis Externs subtypes
export type ExternsSubtype = 'centre-educatiu' | 'altres-entitats';
export type CentreSubtype = 'alumnes' | 'professorat';
export type EntityType =
  | 'ajuntament'
  | 'hospital'
  | 'residencia'
  | 'centre-cultural'
  | 'col-lectiu-empresa'
  | 'entitat-social'
  | 'altres';

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

  // Artperdins
  participantAge: ParticipantAge | '';

  // Centres Educatius
  schoolName: string;
  educationStage: EducationStage | '';
  studentsCount: number | '';
  courseGroup: CourseGroup | '';
  courseInterest: string; // Curs o monogràfic d'interès (opcional)

  // Serveis Externs - subtipus
  externsSubtype: ExternsSubtype | '';
  centreSubtype: CentreSubtype | '';

  // Formació al professorat
  teachersCount: number | '';
  trainingInterest: string;

  // Altres entitats
  entityType: EntityType | '';
  entityName: string;
  entityDescription: string;
  participantsCount: number | '';
  projectDescription: string;

  // Comú
  message: string;
  contactPreference: ContactPreference[];
  availability: Availability | '';

  // RGPD
  privacyAccepted: boolean;

  // 🍯 Honeypot field (anti-bot)
  // This field should ALWAYS be empty if filled by a human
  // Bots will fill it automatically, allowing us to detect them
  website?: string;

  // Cloudflare Turnstile token (anti-bot CAPTCHA)
  // Produced client-side by the Turnstile widget, consumed once server-side.
  turnstileToken: string;
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
  location?: string;
  artperdins?: string;
  artterapia?: {
    session?: boolean;
    time?: boolean;
  };
  // Serveis Externs
  externsSubtype?: string;
  centreSubtype?: string;
  schoolName?: string;
  entityType?: string;
  entityName?: string;
  participantsCount?: string;
}
