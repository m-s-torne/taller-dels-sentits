import type {
  ArttherapyFormat,
  PreferredTime,
  ParticipantAge,
  EducationStage,
  StudentsCount,
  ContactPreference,
  Availability,
} from '@/app/contacte/types';

interface Option<T> {
  value: T;
  label: string;
}

export const arttherapyFormatOptions: Option<ArttherapyFormat>[] = [
  { value: 'individual', label: 'Individual' },
  { value: 'grupal', label: 'Grupal' },
  { value: 'unsure', label: 'No estic segur/a' },
];

export const preferredTimeOptions: Option<PreferredTime>[] = [
  { value: 'morning', label: 'Matins' },
  { value: 'afternoon', label: 'Tardes' },
  { value: 'weekend', label: 'Caps de setmana' },
  { value: 'flexible', label: 'Flexible' },
];

export const participantAgeOptions: Option<ParticipantAge>[] = [
  { value: 'adolescent', label: 'Adolescent (12-17 anys)' },
  { value: 'young-adult', label: 'Jove adult (18-25 anys)' },
  { value: 'adult', label: 'Adult (25+ anys)' },
];

export const educationStageOptions: Option<EducationStage | ''>[] = [
  { value: '', label: 'Selecciona una etapa' },
  { value: 'infantil', label: 'Infantil' },
  { value: 'primaria', label: 'Primària' },
  { value: 'eso', label: 'ESO' },
  { value: 'batxillerat', label: 'Batxillerat' },
];

export const studentsCountOptions: Option<StudentsCount | ''>[] = [
  { value: '', label: 'Selecciona un rang' },
  { value: '<15', label: 'Menys de 15' },
  { value: '15-25', label: '15-25 estudiants' },
  { value: '25-40', label: '25-40 estudiants' },
  { value: '40+', label: 'Més de 40' },
];

export const contactPreferenceOptions: Option<ContactPreference>[] = [
  { value: 'email', label: '📧 Correu electrònic' },
  { value: 'phone', label: '📞 Telèfon' },
  { value: 'whatsapp', label: '💬 WhatsApp' },
];

export const availabilityOptions: Option<Availability>[] = [
  { value: 'morning', label: 'Matins' },
  { value: 'afternoon', label: 'Tardes' },
  { value: 'anytime', label: 'Qualsevol moment' },
];
