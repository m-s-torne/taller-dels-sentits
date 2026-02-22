import type { ServiceType } from '@/app/contacte/types/form.types';
import ArtterapiaIcon from '@/app/_assets/iconos/ESPACIO/NUBES.svg';
import ArtperdinsIcon from '@/app/_assets/iconos/FLOR/PLANTA.svg';
import CentresIcon from '@/app/_assets/iconos/ARTE/DIBUJO.svg';

/**
 * Service type icons mapping
 */
export const serviceIcons: Record<ServiceType, string | null> = {
  artterapia: ArtterapiaIcon.src,
  artperdins: ArtperdinsIcon.src,
  'centres-educatius': CentresIcon.src,
  general: null,
};
