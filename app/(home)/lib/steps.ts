import type { ContentStep } from '@/app/(home)/types/contentSection.types';
import SentirIcon from '@/app/_assets/iconos/ESPACIO/CORAZON.svg';
import PermisIcon from '@/app/_assets/iconos/ESPACIO/VENTANA.svg';
import CrearIcon from '@/app/_assets/iconos/CUERPO/MANOS.svg';

export const contentSteps: ContentStep[] = [
    { key: 'sentir', label: 'SENTIR', icon: SentirIcon.src },
    { key: 'permis', label: 'EXPRESSAR', icon: PermisIcon.src },
    { key: 'crear', label: 'CREAR', icon: CrearIcon.src }
];
