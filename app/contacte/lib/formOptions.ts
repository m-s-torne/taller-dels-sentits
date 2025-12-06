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
  { value: 'adolescent', label: 'Adolescents (12-15 anys)' },
  { value: 'young-adult', label: 'Joves (15-20 anys)' },
  { value: 'adult', label: 'Adults (20 anys o més)' },
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

export const courseGroupOptions = {
  infantil: [
    { value: '', label: 'Selecciona un curs' },
    { value: 'I3', label: 'I3' },
    { value: 'I4', label: 'I4' },
    { value: 'I5', label: 'I5' },
  ],
  primaria: [
    { value: '', label: 'Selecciona un curs' },
    { value: '1r', label: '1r Primària' },
    { value: '2n', label: '2n Primària' },
    { value: '3r', label: '3r Primària' },
    { value: '4t', label: '4t Primària' },
    { value: '5è', label: '5è Primària' },
    { value: '6è', label: '6è Primària' },
  ],
  eso: [
    { value: '', label: 'Selecciona un curs' },
    { value: '1r ESO', label: '1r ESO' },
    { value: '2n ESO', label: '2n ESO' },
    { value: '3r ESO', label: '3r ESO' },
    { value: '4t ESO', label: '4t ESO' },
  ],
  batxillerat: [
    { value: '', label: 'Selecciona un curs' },
    { value: '1r Batxillerat', label: '1r Batxillerat' },
    { value: '2n Batxillerat', label: '2n Batxillerat' },
  ],
};

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
