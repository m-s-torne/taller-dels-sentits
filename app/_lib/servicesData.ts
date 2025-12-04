import { artterapiaQuotes, artperdinsQuotes } from '@/app/_lib/quotes';
import ArtterapiaIcon from '@/app/_assets/iconos/ESPACIO/NUBES.svg';
import ArtperdinsIcon from '@/app/_assets/iconos/FLOR/PLANTA.svg';
import CentresIcon from '@/app/_assets/iconos/ARTE/DIBUJO.svg';
import type { ServiceSectionType } from '@/app/_types/services.types';

export const servicesData: ServiceSectionType[] = [
    {
        id: 'artterapia',
        title: 'ARTTERÀPIA',
        subtitle: "Acompanyem les persones en els seus processos vitals a través de les eines de l'Art.",
        shortDescription: "Acompanyem les persones en els seus processos vitals a través de les eines de l' Art.",
        quotes: artterapiaQuotes,
        bgColor: 'bg-lilac',
        contentKey: 'artterapia',
        delay: 0.2,
        icon: ArtterapiaIcon.src
    },
    {
        id: 'artperdins',
        title: 'ARTPERDINS',
        subtitle: "Cursos anuals d'Acompanyament Creatiu d'Expressió Artística per a Adolescents Joves i Adults. Quan fa que no pintes",
        shortDescription: "Cursos anuals d'Acompanyament Creatiu d'Expressió Artística per a Adolescents\nJoves i Adults.",
        quotes: artperdinsQuotes,
        bgColor: 'bg-lilac',
        contentKey: 'artperdins',
        delay: 0.3,
        icon: ArtperdinsIcon.src
    },
    {
        id: 'centres-educatius',
        title: 'CENTRES EDUCATIUS',
        subtitle: "Sessions monogràfiques per a la difusió pedagògica de les Arts Plàstiques.",
        shortDescription: "Sessions monogràfiques per a la difusió pedagògica de les Arts Plàstiques.",
        quotes: [],
        bgColor: 'bg-lilac',
        contentKey: 'centres-educatius',
        delay: 0.4,
        icon: CentresIcon.src
    }
];
