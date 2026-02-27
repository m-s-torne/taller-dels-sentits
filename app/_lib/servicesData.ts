import ArtterapiaIcon from '@/app/_assets/iconos/ESPACIO/NUBES.svg';
import ArtperdinsIcon from '@/app/_assets/iconos/FLOR/PLANTA.svg';
import CentresIcon from '@/app/_assets/iconos/ARTE/DIBUJO.svg';
import PaletaIcon from '@/app/_assets/iconos/ARTE/PALETA.svg';
import GestoIcon from '@/app/_assets/iconos/CUERPO/GESTO.svg';
import CreatividadIcon from '@/app/_assets/iconos/CUERPO/CREATIVIDAD.svg';
import PinturasIcon from '@/app/_assets/iconos/ARTE/PINTURAS.svg';
import type { ServiceSectionType } from '@/app/_types/services.types';

export const servicesData: ServiceSectionType[] = [
    {
        id: 'artterapia',
        title: 'ARTTERÀPIA',
        subtitle: "Acompanyem les persones en els seus processos vitals a través de les eines de l'Art.",
        shortDescription: "Acompanyem les persones en els seus processos vitals a través de les eines de l' Art.",
        longDescription: [
            `Per la meva trajectòria personal i professional he pogut experimentar l’eficàcia dels llenguatges 
            artístics per incidir en la qualitat del viure de les persones, i també com un acompanyament acurat i 
            respectuós pot ajudar a l’ expressió de l’àmbit emocional i al desplegament d’ una simbolització 
            inherent, que fa que es mobilitzin els propis recursos reguladors i resolutius davant de les 
            dificultats emocionals, físiques, psicològiques o socials i que poden influir de forma clara 
            en la nostra salut.`,

            `Les meves eines i recursos provenen inicialment de formació artística i han estat els postgraus i 
            màsters en artteràpia i Acompanyament Creatiu els que han configurat el marc teòric per vincular-les 
            a la salut de les persones i aplicar-les de forma terapèutica. Les línies de treball es basen en 
            l’enfocament artterapèutic del psiquiatra Jean- Pierre Klein, la teràpia de joc de Violet Oaklander i l’artteràpia 
            des d’ un enfocament gestàltic de Javier Melguizo.`,

            `En els darrers anys, la nostra experiència professional s’ha anat centrant en l’àmbit
            artterapèutic, tant en dispositius individuals com en grups reduïts, atenent infants,
            adolescents, joves i adults.`,

            `Des del Taller dels Sentits, hem configurat i realitzat projectes artterapèutics a persones
            cuidadores de familiars amb Alzheimer dins el projecte “Cuidem-nos per Cuidar” del CAP
            Les Roquetes; el projecte “Guardar la Vida” de l’Ajuntament de Vilanova i la Geltrú per a
            Centres de dia i Residències; el projecte per a persones cuidadores a càrrec de persones
            amb diagnòstic TEA dels Serveis Socials del Consell Comarcal del Garraf i el Projecte
            Envelliment Km 0; grups de dones en el servei d’atenció a la dona,SIAD de Vilafranca del
            Penedès. També hem configurat i realitzat el projecte “Tots els colors de l’aire” per a les
            escoles de primària de Vilanova i la Geltrú arran del confinament, així com sessions a
            empreses com el col.lectiu de professionals de l’Institut Psicològic Arrels de Vilanova i la
            Geltrú.`,
        ],
        quote: {
            text: "Tingueu paciència amb tot allò que no està resolt en el vostre cor i intenteu estimar-ne les preguntes",
            author: "Rainer Maria Rilke. Poeta"
        },
        questions: [
            {
                service: 'artterapia',
                text: `Necessites un espai per escoltar-te ?`
            },
            {
                service: 'artterapia',
                text: `Necessites fer un treball acompanyat en el moment vital que travesses?`
            },
            {
                service: 'artterapia',
                text: `Voldries connectar amb la teva capacitat creativa per resoldre alguna problemàtica?`
            },
            {
                service: 'artterapia',
                text: `Tens ganes de fer un treball d'autoconeixement a través de les eines de l'art?`
            }
        ],
        moreContent: {
            buttonText: `
                L'art és un viatge cap endins... Un viatge cap enfora... \n 
                És en aquest vaivé que ens posa en moviment i pot ser transformador
            `,
            content: [
                `L’Art estimula les teves capacitats expressives i creatives. La seva 
                dimensió dinàmica i simbòlica afaforeix el desbloqueig d’emocions i 
                pensaments, alhora que obre noves maneres de poder mirar i 
                mirar-te.

                L'artteràpia desplega un espai d'acompanyament terapèutic on els 
                llenguatges i processos artístics t’ajuden a trobar les estratègies i 
                recursos propis per elaborar i donar resposta a moments vitals que 
                puguis travessar.`,
                `El marc acompanyant de l'artteràpia és un espai d'autoconeixement que facilita:`
            ],
            listItems: [
                `L'Expressió del nostre sentir`,
                `Desenvolupa l'empatia`,
                `Potencia la capacitat creativa i per tant resolutiva`,
                `Millora l'autoestima i activa la nostra part més vital`,
                `Incrementa l'autonomia`,
                `Disminueix l'ansietat i pot ser una eina de gran valor per elaborar experiències traumàtiques o dificultats passades o del present`,
            ],
        },
        bgColor: 'bg-lilac',
        contentKey: 'artterapia',
        icon: ArtterapiaIcon.src,
        disclaimer: [
            `Per fer aquestes sessions no és necessari que siguis habilidós ni tenir formació artística.`,
            `Els serveis d'artteràpia no són sanitaris ni substitueixen tractament mèdics. L'acceptació és voluntària i responsable.`
        ],
        reviews: [
            {
                review: `
                    Mai hauria imaginat el poder que pot
                    tenir l’ expressió artística en la 
                    vida personal, per canalitzar i prendre 
                    consciència dels efectes que poden tenir 
                    en una persona les experiències viscudes. 
                    Gràcies al Taller i a activitats biogràfiques 
                    com el collage, he vist que això és possible: 
                    et coneixes a tu mateix, revius i reformules 
                    fets que han marcat la teva vida i t’adones 
                    d’allò que ja no pot canviar, però també de 
                    tot el que sí pots modificar. A més a més, 
                    el caliu que es genera en el grup i 
                    l’ acompanyament de la professora fan que 
                    tot plegat es converteixi en una experiència 
                    única on expressar lliurement idees i emocions 
                    a través de l’art.`,
                author: `M.`,
            },
            {
                review: `
                    Estic molt contenta. M'has ajudat molt. Va ser una experiència inoblidable. 
                    Esto lo dice una niña de 11 años... importante edad de la reseña. Con las clases 
                    de arteterapia, mi hijo consiguió entender lo que sentía y aprendió a expresarlo, 
                    sin palabras con sus "pequeñas obras". Míriam consiguió entrar en su mundo... y 
                    abrir puertas... Estaremos eternamente agradecidos...`,
                author: `Mare d'una nena d'11 anys.`,
            },
            {
                review: `
                    Comencé mis vacaciones escolares con ocho sesiones de arteterapia, llenas de luz 
                    y diversión. En todas ellas, estuve en un ambiente relajado y con una arteterapeuta 
                    cómplice, que me ayudó a mostrar y analizar mis sentimientos. Cada sesión se 
                    convirtió en un refugio en el que podía expresarme libremente, sin miedo a ser 
                    juzgada, simplemente me dejé llevar por mi mente y mi corazón. El arte y la pintura 
                    me guiaron a un mayor autoconocimiento y me hicieron sentir cada vez más liberada 
                    de mis preocupaciones interiores.`,
                author: `Jove de 15 anys.`,
            },
            {
                review: `
                    Va ser un moment especial, una motivació que creixia setmana rera setmana. Ell 
                    tenia l'opció de poder crear elements fantàstics amb els que s'identificava 
                    emocionalment, descobrint fortaleses i identificant frustracions. La Míriam 
                    l'acompanyava en aquest procés i, de mica en mica, les converses amb ella, aquestes 
                    estones, es van convertir en imprescindibles, en un motor que generava alegria i 
                    que ell esperava amb ganes. El final va arribar sense ganes d'acabar, però el procés 
                    viscut li havia donat eines per expressar els seus neguits i per fer servir les 
                    emocions per crear i per descobrir una mena de fortalesa personal que l'ajudi a 
                    viure les experiències de vida.`,
                author: `Mare d'un adolescent de 12 anys.`,
            },
            {
                review: `
                    És un diàleg interior que et 
                    connecta profundament amb la 
                    teva esséncia i et mostra les teves 
                    virtuts i ferides per poder així 
                    reconèixer-les i començar a sanar.`,
                author: `Adulta dins un treball de grup.`,
            },
            {
                review: `
                    Moltes gràcies per la mirada, 
                    l’acompanyament i la feina feta. 
                    Han estat uns moments 
                    privilegiats que l’han ajudat a 
                    créixer, avançar i a nosaltres a 
                    comprendre’l.`,
                author: `Mare d'un nen de 9 anys.`,
            },
            {
                review: `
                    Vaig fer Artteràpia amb el Víctor per 
                    tal de continuar amb el meu procés terapèutic 
                    des d’una perspectiva diferent: utilitzant menys 
                    la racionalitat de les paraules i més de les 
                    emocions dels sentits. A través de diverses 
                    peces i processos vaig anar construïnt des de 
                    la cura, els detalls, el repòs, la serenor. El 
                    Víctor em va ajudar a veure que, de vegades, una 
                    tortuga a mig fer pot ser un dofí, una onada o 
                    quelcom altre encara per imaginar; que els que ens 
                    passa dins passa també fora; i que l’art, com el dia 
                    a dia, es transforma amb la mirada.`,
                author: `Jove de 19 anys.`,
            },
            {
                review: `
                    Trabajar en sesiones idividuales con Miriam es laborioso
                    y por ello, muy enriquecedor. Sabe guiarte y, sobretodo,
                    acompañarte amorosamente en el camino que emprendes para
                    mejorar o para solventar esa encrucijada que se te presenta.
                    Con múltiples recursos, no solo plásticos o de materiales, 
                    sino también de espacio, de música, de palabras dichas o escritas,
                    de hacer partícipe a todo el cuerpo, todo colabora para cambiar
                    el punto de vista, para escucharse de verdad, para dejar fuera el
                    juicio y avanzar a una nueva perspectiva. Sus sesiones son una
                    formidable herramienta de autoconocimiento para quien esté
                    dispuesto a trabajarse.
                `,
                author: `Alumna de les sessions per a adults.`,
            },
            {
                review: `
                    Las sesiones de Arteterapia con Miriam me han ayudado a transitar
                    momentos vitales de alta intensidad emocional. En cada sesión Miriam
                    me ha guiado con exquisita delicadeza a conectar con mi interior,
                    a dar forma o expresión a aquello que sentía. Han sido una llave de entrada
                    a una parte de mí que tenía algo olvidada, esa parte más intuitiva, creadora
                    y sanadora que todas llevamos dentro. Ha sido un trabajo altamente terapéutico
                    que recomiendo a cualquiera. Gracias de todo corazón, Miriam.`,
                author: `Raquel.`,
            }
        ],
        rest: {
            title: `T'OFEREIXO`,
            subtitle: `Un acompanyament respectuós i curós per poder fer un treball sobre tu mateix ja sigui perquè:`,
            list: [
                `Tens ganes de fer un treball d’ autoconeixement`,
                `Voldries reconnectar amb la teva vitalitat i plaer`,
                `Necessites fer un treball acompanyat en el moment vital en què et trobes`,
                `Perquè la paraula ha quedat limitada per abordar i entendre què t’està passant`,
                `Perquè necessites connectar amb la teva capacitat creativa per resoldre alguna problemàtica`,
                `Necessites escoltar què t’ està passant i portar-lo en un espai on ho puguis expressar i et puguis sentir 
                acompanyat per poder-ho mirar`
            ],
            description: `
                Per la seva dimensió expressiva i simbólica l’artteràpia pot ser un bon recurs terapèutic per a adults, joves i 
                adolescents que necessiten sortir del marc de la paraula, així com ho és també, per la seva qualitat 
                lúdica, de gran valor pels infants.`,
            sessionTypes: [
                {
                    desc: `Sessions individuals amb periodicitat setmanal o quinzenal.`,
                    icon: GestoIcon.src,
                },
                {
                    desc: `Monogràfics amb grup reduït per abordar temes concrets.`,
                    icon: CreatividadIcon.src,
                },
                {
                    desc: `Sessions externes per a centres educatius, ajuntaments, 
                            hospitals, residències, centres culturals, col.lectius 
                            d’ empresa i entitats socials.`,
                    icon: PinturasIcon.src,
                }
            ]
        }
    },
    {
        id: 'artperdins',
        title: 'ARTPERDINS',
        subtitle: "Cursos anuals d'Acompanyament Creatiu d'Expressió Artística per a Adolescents, Joves i Adults.",
        shortDescription: "Cursos anuals d'Acompanyament Creatiu d'Expressió Artística per a Adolescents\nJoves i Adults.",
        exclamation: "Et convido a provar els nostres cursos de L’ Artperdins!",
        longDescription: [
            `Amb 15 anys de trajectòria de L’Artperdins, hem anat configurant una metodologia pròpia per a 
            adolescents, joves i adults que integra el coneixement de les eines i tècniques artístiques amb 
            l’Acompanyament Creatiu i l’Artteràpia.`,
            `L’Artperdins és un espai per fer-nos espai a nosaltres. Un lloc de permís i de cura, d’ escolta interna i per 
            tant d’aprenetatge a través del joc de l’Art. La dimensió lúdica de l’Art permet recuperar un tipus 
            d’aprenentatge des de nosaltres i cap a nosaltres, que sovint podem descuidar. És un tipus 
            d’aprenentatge que parteix del Sentir i que afavoreix la correlació de l’intel·lecte i les emocions i dona la
            possibilitat de descobrir aspectes nous de nosaltres estimulant la pròpia capacitat reflexiva i creativa, 
            imprescindibles davant de qualsevol problemàtica que ens puguem trobar.`,
        ],
        quote: {
            text: "Perquè la bellesa transforma, és una arma carregada de futur.",
            author: "Gabriel Celaya. Poeta"
        },
        questions: [
            {
                service: 'artperdins',
                text: `Necessites un espai per a escoltar-te durant la setmana?`
            },
            {
                service: 'artperdins',
                text: `T' agradaria provar d' expressar-ho tu mateix?`
            },
            {
                service: 'artperdins',
                text: `Alguna vegada mirant una pintura has sentit que expressava com cap altra cosa el que tu senties en aquell moment?`
            },
            {
                service: 'artperdins',
                text: 'Quant fa que no pintes?'
            }
        ],
        moreContent: {
            buttonText: `
                L'art és un viatge cap endins... Un viatge cap enfora... \n 
                És en aquest vaivé que ens posa en moviment i pot ser transformador
            `,
            content: [
                `Les nostres eines seran els pinzells, els acrílics, els papers de petit i gran format, les teles, els olis i els 
                pigments, les aquarel.les, els carbonets i les sanguines, l’argila, els esmalts i els òxids, les fustes, les 
                gúbies i les tintes… Tot estarà a la nostra disposició per endinsar-nos gradualment en el món del 
                Dibuix i la Pintura, del coneixement del Color, les Formes i el Traç, l’experiència del treball en Volum i 
                del Collage…`,
                `El treball plàstic és sobretot un treball individual, però també hi hauran moltes propostes
                col·lectives que s’aniran desplegant al llarg del curs. El grup serà important pel clima de treball i el 
                vincle amb ell ajudarà a sostenir tot allò que vagi sorgint, així com també serà clau per compartir si 
                es fa necessari i tancar la sessió.
                
                No buscarem una manera "correcta" de pintar, ni donarem valor a una idea
                predeterminada de l’estètica. Partirem del que som i d’ allò que ens configura, fent valer la nostra 
                mirada de les coses des de les eines que ens proporciona l’Art, tot afavorint un treball personal.`,
            ],
        },
        reviews: [
            {
                review: `
                    És un espai viu i cuidat on es 
                    respira un profund respecte, 
                    humanitat i professionalitat. Per 
                    a mi és un temps per estar amb 
                    mi mateixa i en relació amb 
                    d’altres persones motivades per 
                    interessos comuns.`,
                author: `T.`,
            },
            {
                review: `
                    La meva experiència ha sigut un gran viatge de transformació interior,
                    molt intens i enriquidor. Gràcies Míriam, pel teu delicat i respectuós
                    acompanyament i suport, des de la foscor, al retrobament conscient
                    de la meva llum.`,
                author: `A.`
            },
            {
                review: `
                    L’experiència és profunda i 
                    intensa, una proposta de valor 
                    que et permet connectar art i 
                    vivència personal. Dibuixar el 
                    nostre paisatge interior.`,
                author: `M.`,
            },
            {
                review: `
                    He estat un any en aquest viatge. Ha estat un viatge al meu interior.
                    Ha estat un viatge de la meva història. M'he explicat la meva història
                    sense judicis, creant, expressant, sortint el que sortia. Aquestes
                    creacions han estat un mirall de què he viscut, de què sóc, de què sento.
                    Ha estat un viatge conegut, però sortia l'expressió tan clara que les ferides
                    sanaven. Un trajecte petit però immens, acompanyada per la Míriam.`,
                author: `Anònima.`,
            },
        ],
        rest: {
            title: `Els Monogràfics de l’Artperdins:`,
            content: [
                `En un format més petit , els monogràfics són una bona alternativa per a qui no disposa de molt 
                de temps. Són esporàdics i que poden anar des de propostes i seminaris artístics amb una temàtica 
                concreta, experiències artístiques o visites guiades a exposicions.`,
            ],
            images: [],
        },
        disclaimer: [
            `Per fer aquestes sessions no és necessari que siguis habilidós ni tenir formació artística.`,
            `Els serveis d'artteràpia no són sanitaris ni substitueixen tractament mèdics. L'acceptació és voluntària i responsable.`
        ],
        bgColor: 'bg-lilac',
        contentKey: 'artperdins',
        icon: ArtperdinsIcon.src
    },
    {
        id: 'centres-educatius',
        title: 'CENTRES EDUCATIUS',
        subtitle: "Sessions monogràfiques per a la difusió pedagògica de les Arts Plàstiques.",
        shortDescription: "Sessions monogràfiques per a la difusió pedagògica de les Arts Plàstiques.",
        longDescription: [`
            Oferim sessions especialitzades per a centres educatius, dissenyades per apropar l’art i la creativitat als 
            estudiants de diferents edats. Les activitats estan pensades per complementar l’educació formal, 
            fomentant la creativitat i l’expressió personal.`,
            
            `Les sessions poden adaptar-se als objectius pedagògics de cada centre i grups d’edats, treballant diferents 
            tècniques artístiques i temàtiques segons les necessitats específiques. Les activitats promouen un 
            aprenentatge vivencial i significatiu a través de l’experiència artística.
        `],        
        quote: {
            text: "Només jugant som creatius, i és d'aquesta manera que ens arribem a conèixer",
            author: "Donald W. Winnicott. Pediatre i psicoanalista."
        },
        questions: [],
        moreContent: {
            buttonText: `Formació per al professorat`,
            content: [
                `L'objectiu d'aquest curs de formació i assessorament per a 
                professors d'infantil i primària, és la de repensar els objectius 
                propis en l'àrea d'Expressió Plàstica, així com la seva metodologia.
                
                Per iniciar aquest procés de replantejament és molt important començar 
                atenent quin tipus de relació té el professorat amb l’Art, què es considera 
                que ho és i què no i com es tradueix en les seves propostes de treball 
                de cara als alumnes i en la valoració que en fan del resultat.`,
                `Per tal que la Plàstica tingui contingut en l’àmbit educatiu, serà important 
                que la proposta plantejada als infants la possibilitat de Significar, és a dir, 
                que pugui ser suficientment àmplia perquè l’alumne pugui investigar i dotar-la 
                de sentit personal.
                
                Amb la finalitat que aquest Significar tingui un sentit ampli, la proposta formativa 
                tindrà un caràcter transversal, entenent la importància de la multiplicitat de 
                llenguatges artístics (poesia, música, dansa…) i com aquesta amplitud de llenguatges 
                ens permet estirar el fil de les propostes i la integració i elaboració d'aprenentatges.
                
                Es treballarà sobre paraules clau: la Proposta, la Implicació, el Procés de realització i 
                de les diferències entre Creació i Expressió.`,
            ],
        },
        disclaimer: [],
        rest: {
            title: "APRENDRE A MIRAR UN QUADRE",
            icon: PaletaIcon.src,
            content: [
                `És realment d'aquesta forma que l'obra d'art pot ser significativa per a cada nen. I és una manera 
                enriquidora d'acostar-se a ell mateix, tot abordant la creació des de la pròpia sensibilitat, 
                atenent els sentits, els sentiments i les seves pròpies vivències. Des del Taller dels Sentits, 
                creiem, doncs, que l'educació de l'art no s'ha de centrar exclusivament en l'habilitat manual o el 
                coneixement tècnic, ni afavorir un sol gust estètic.`,
                `L'art és transformador. Sabem que la plàstica és també coneixement i la seva pràctica dóna als 
                infants més recursos de reflexió, de comprensió d'ells mateixos i del món que els envolta. El fet 
                d'implicar-los en un procés creatiu afavoreix les seves capacitats expressives i de comunicació, fomenta 
                l'autoestima, tot aprenent a valorar la pròpia mirada de les coses i el respecte per la mirada dels altres.`,
                `El Taller dels Sentits porta a terme un projecte per a les escoles cada cop més consolidat. El nostre 
                objectiu és difondre de manera entenedora el motiu pel qual un artista o un moviment artístic busca i 
                troba les seves "maneres de fer". Les sessions duren aproximadament una hora: després d'una explicació 
                interactiva amb els alumnes i amb l'us d'imatges, sempre es proposa un treball plàstic, amb prou marge 
                per tal que l'alumne interioritzi els arguments que han portat l'artista a crear la seva obra i se'ls faci seus.`,
            ],
        },
        bgColor: 'bg-lilac',
        contentKey: 'centres-educatius',
        icon: CentresIcon.src
    }
];
