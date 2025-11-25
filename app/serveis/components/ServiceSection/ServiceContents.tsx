import CorazonIcon from '@/app/_assets/iconos/ESPACIO/CORAZÓN.svg';
import ManosIcon from '@/app/_assets/iconos/CUERPO/MANOS.svg';
import PaletaIcon from '@/app/_assets/iconos/ARTE/PALETA.svg';
import PlantaIcon from '@/app/_assets/iconos/FLOR/PLANTA.svg';

export const ArtterapiaContent = () => (
    <section className="space-y-8 text-gray-700 text-sm sm:text-lg leading-relaxed">
        {/* Icono Corazón - Acompañamiento emocional - DESTACADO */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 my-10 md:my-12">
            <img 
                src={CorazonIcon.src} 
                alt="Corazón" 
                className="w-36 h-36 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 shrink-0"
            />
            <div className="space-y-4">
                <p>
                    Per la meva trajectòria personal i professional he pogut experimentar de <strong className="italic">l'eficàcia dels llenguatges artístics per incidir en la qualitat del viure de les persones</strong> i també com <strong className="italic">un acompanyament acurat i respectuós</strong>, pot ajudar a l'expressió de l'àmbit emocional i al desplegament d'una simbolització inherent a la persona que fa que es mobilitzin els propis recursos reguladors i resolutius davant de les dificultats emocionals, físiques, psicològiques o socials i que poden incidir de forma clara en la salut de la persona.
                </p>
                
                <p className="italic">
                    Les meves eines i recursos provenen inicialment dels meus estudis artístics i han estat els post-graus i màsters en Artteràpia i Acompanyament Creatiu que han configurat el meu marc teòric per vincular-les a la salut de les persones i aplicar-les de forma terapèutica. Les meves línees de treball es basen en l'enfoc arterapèutic del psiquiatra Jean- Pierre Klein, la teràpia de joc de Violet Oaklander i l'artteràpia des d'un enfoc gestàltic de Javier Melguizo.
                </p>
            </div>
        </div>

        <p>
            Necessites un espai per escoltar-te ?<br />
            Tens ganes de fer un treball d' autoconeixement a través de les eines de l' art?<br />
            Necessites fer un treball acompanyat en el moment vital que travesses?<br />
            voldries connectar amb la teva capacitat creativa per resoldre alguna problemàtica'?
        </p>

        <p>
            L'Art estimula les teves capacitats expressives i creatives. La seva dimensió dinàmica i simbòlica afaforeix el desbloqueig d' emocions i pensaments, alhora que obre noves maneres de poguer mirar i mirar-te.
        </p>
        
        <p>
            L' Artteràpia desplega un espai d'acompanyament terapèutic on els llenguatges i processos artístics t'ajuden a trobar les estratègies i recursos propis per elaborar i donar resposta a moments vitals que puguis travessar.
        </p>

        <div className="my-10">
            <p className="mb-3">
                El marc acompanyat de l' Artteràpia és un espai d' autoconeixement que facilita:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 md:pl-8">
                <li>l' expressió del nostre sentir,</li>
                <li>desenvolupa l' empatia,</li>
                <li>potencia la capacitat creativa i per tant resolutiva,</li>
                <li>millora l' autoestima i activa la nostra part més vital</li>
                <li>Incrementa l' autonomia</li>
                <li>disminueix l' ansietat i pot ser una eina de gran valor per elaborar experiències traumàtiques o dificultats passades o del present.</li>
            </ul>
        </div>

        {/* Icono Manos - T'ofereixo - DESTACADO */}
        <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-8 md:gap-12 my-10 md:my-12">
            <img 
                src={ManosIcon.src} 
                alt="Manos" 
                className="w-36 h-36 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 shrink-0"
            />
            <div className="space-y-4">
                <p className="font-semibold text-base sm:text-xl">
                    T' ofereixo
                </p>
                <p>
                    Un acompanyament respectuós i curós per poguer fer un treball sobre tu mateix ja sigui perquè:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 md:pl-6">
                    <li>tens ganes de fer un treball d' autoconeixement.</li>
                    <li>voldries reconnectar amb la teva vitalitat i plaer.</li>
                    <li>necessites fer un treball acompanyat en el moment vital que et trobes.</li>
                    <li>perquè la paraula ha quedat limitada per abordar i entendre què t' està passant.</li>
                    <li>perquè necessites connectar amb la teva capacitat creativa per resoldre alguna problemàtica.</li>
                </ul>
            </div>
        </div>
        <p>
            Necessites escoltar què t' està passant i portar-lo en un espai que ho puguis expressar i et puguis sentir acompanyat per poguer-ho mirar.
        </p>

        <p>
            Per la seva dimensió expressiva i simbólica L'Artteràpia pot ser un bon recurs terapèutic per a joves i adolescents que necessiten sortir del marc de la paraula així com ho és també, per la seva qualitat lúdica, de gran valor pels infants.
        </p>

        <p className="font-semibold">
            Per fer aquestes sessions no és necessari que siguis hàbil ni que tinguis formació artística.
        </p>
        <p className="italic text-xs sm:text-sm">
            Els serveis d' artteràpia no són sanitaris ni substitueixen tractament mèdics. L'acceptació és voluntària i responsable.
        </p>
    </section>
);

export const ArtperdinsContent = () => (
    <section className="space-y-8 text-gray-700 text-sm sm:text-lg leading-relaxed">
        <p>
            Necessites un espai per a escoltar-te durant la setmana?<br />
            Alguna vegada mirant una pintura has sentit que expressava com cap altra cosa el que tu senties en aquell moment?<br />
            T' agradaria provar d' expressar-ho tu mateix?
        </p>
        <p className="font-semibold text-base sm:text-xl">
            Et convido a provar els nostres cursos de L' Artperdins!
        </p>

        {/* Icono Paleta - Metodologia - DESTACADO */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 my-10 md:my-12">
            <img 
                src={PaletaIcon.src} 
                alt="Paleta" 
                className="w-36 h-36 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 shrink-0"
            />
            <div className="space-y-4">
                <p>
                    Amb 15 anys de trajectòria de L'Artperdins, hem anat configurant una metodologia pròpia per a adolescents, joves i adults que integra el coneixement de les eines i tècniques artístiques amb l' Acompanyament Creatiu i l'Artteràpia.
                </p>
                <p>
                    L'Artperdins és un espai per fer-nos espai a nosaltres. Un lloc de permís i de cura, d' escolta interna i per tant d' aprenetatge a través del joc de l'Art. La dimensió lúdica de l'Art permet recuperar un tipus d'aprenentatge des de nosaltres i cap a nosaltres, que sovint podem descuidar. És un tipus d'aprenentatge que parteix del Sentir i que afavoreix la correlació de l'intel·lecte i les emocions i dona la possibilitat de descobrir aspectes nous de nosaltres estimulant la pròpia capacitat reflexiva i creativa, imprescindibles davant de qualsevol problemàtica que ens puguem trobar.
                </p>
            </div>
        </div>

        <p>
            Les nostres eines seran els pinzells, els acrílics, els papers de petit i gran format, les teles, els olis i els pigments, les aquarel.les, els carbonets i les sanguines, l'argila, els esmalts i els òxids, les fustes, les gúbies i les tintes… Tot estarà a la nostra disposició per endinsar-nos gradualment en el món del Dibuix i la Pintura, del coneixement del Color, les Formes i el Traç, l'experiència del treball en Volum i del Collage….
        </p>
        
        <p>
            El treball plàstic és sobretot un treball individual, però també hi hauran moltes propostes col.lectives que s'aniran desplegant al llarg del curs. El grup serà important pel clima de treball i el vincle amb ell ajudarà a sostenir tot allò que vagi sorgint, així com també serà clau per compartir si es fa necessari i tancar la sessió.
        </p>

        <p>
            No buscarem una manera "correcta" de pintar, ni donarem valor a una idea predeterminada de l'estètica. Partirem del que som i d' allò que ens configura, fent valer la nostra mirada de les coses des de les eines que ens proporciona l'Art, tot afavorint un treball personal.
        </p>

        <p className="font-semibold">
            Per fer aquest curs no és necessari ser hàbil ni tenir cap formació artística prèvia. Les places són limitades.
        </p>

        <h3 className="text-shakespeare text-base sm:text-xl lg:text-2xl font-light tracking-wide mt-10 mb-4">
            Els Monogràfics de l'<em>Artperdins</em>:
        </h3>
        <p>
            Amb un format més petit, els monogràfics són una bona alternativa per a qui no disposa de molt temps. Són esporàdics i que poden anar des de propostes i seminaris artístics amb una temàtica concreta, experiències artístiques o visites guiades a exposicions.
        </p>
    </section>
);

export const CentresEducatiusContent = () => (
    <section className="space-y-8 text-gray-700 text-sm sm:text-lg leading-relaxed">
        {/* Icono Planta - Crecimiento educativo - DESTACADO */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 my-10 md:my-12">
            <img 
                src={PlantaIcon.src} 
                alt="Planta" 
                className="w-36 h-36 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 shrink-0"
            />
            <div className="space-y-4">
                <p>
                    Oferim tallers i sessions especialitzades per a centres educatius, dissenyades per apropar l'art 
                    i la creativitat als estudiants de diferents edats. Les activitats estan pensades per complementar 
                    l'educació formal, fomentant la creativitat i l'expressió personal.
                </p>
                <p>
                    Les sessions poden adaptar-se als objectius pedagògics de cada centre i grups d'edat, treballant 
                    diferents tècniques artístiques i temàtiques segons les necessitats específiques. Les activitats 
                    promouen un aprenentatge vivencial i significatiu a través de l'experiència artística.
                </p>
            </div>
        </div>
    </section>
);

import type { ReactElement } from 'react';

// Mapa de contenidos para acceso dinámico
export const serviceContents: Record<string, () => ReactElement> = {
    artterapia: ArtterapiaContent,
    artperdins: ArtperdinsContent,
    'centres-educatius': CentresEducatiusContent
};
