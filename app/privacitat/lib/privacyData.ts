export interface PrivacySection {
  id: string;
  title: string;
  content: string | string[];
}

export const privacyData = {
  meta: {
    lastUpdate: "28/12/2025",
    version: "1.0",
  },

  responsable: {
    nombre: "Taller dels Sentits",
    nif: "XXXXXXXXX", // A completar pel client
    direccion: "Vilanova i la Geltrú, Barcelona",
    email: "tallerdelssentits@gmail.com",
    telefono: "XXX XXX XXX", // A completar pel client
  },

  sections: [
    {
      id: "1",
      title: "1. Qui és el responsable del tractament de les teves dades?",
      content: `Responsable: Taller dels Sentits
NIF: XXXXXXXXX
Adreça: Vilanova i la Geltrú, Barcelona
Correu electrònic: tallerdelssentits@gmail.com
Telèfon: XXX XXX XXX

El Taller dels Sentits és el responsable del tractament de les dades personals que ens proporciones a través del formulari de contacte de la nostra pàgina web.`,
    },
    {
      id: "2",
      title: "2. Quines dades personals recollim?",
      content: [
        "Nom i cognoms: Per poder identificar-te i dirigir-nos a tu de manera personalitzada.",
        "Correu electrònic: Per respondre a la teva consulta i mantenir comunicació amb tu.",
        "Telèfon (opcional): Per contactar-te si ho prefereixes per aquesta via.",
        "Població (opcional, obligatori per centres): Especialment rellevant per a serveis de centres educatius.",
        "Missatge i informació addicional: Detalls sobre la teva consulta, servei d'interès (artterapia, artperdins, centres educatius o consulta general), i altres dades que decideixis compartir voluntàriament relacionades amb el servei sol·licitat.",
      ],
    },
    {
      id: "3",
      title: "3. Amb quina finalitat tractem les teves dades?",
      content: `Les teves dades personals es tracten amb les següents finalitats:

Finalitat principal: Respondre a la teva consulta i proporcionar-te informació sobre qualsevol dels nostres serveis (artterapia, artperdins o centres educatius).

Gestió de serveis: Si decideixes contractar algun dels nostres serveis, les teves dades s'utilitzaran per gestionar adequadament la prestació del servei.

Comunicació: Enviar-te informació rellevant relacionada amb la teva consulta o servei sol·licitat.

NO utilitzem les teves dades per a finalitats comercials no sol·licitades, ni les cedim a tercers amb fins publicitaris.`,
    },
    {
      id: "4",
      title: "4. Quina és la base legal per al tractament?",
      content: `La base legal per al tractament de les teves dades és el consentiment explícit que ens proporciones en marcar la casella d'acceptació de la política de privacitat abans d'enviar el formulari (art. 6.1.a del RGPD).

Aquest consentiment és:
- Lliure: pots decidir no proporcionar-nos les teves dades.
- Específic: saps exactament per a què utilitzarem les teves dades.
- Informat: aquesta política t'explica com tractem les teves dades.
- Inequívoc: has d'acceptar activament abans d'enviar el formulari.

Pots retirar el teu consentiment en qualsevol moment contactant-nos per correu electrònic: tallerdelssentits@gmail.com`,
    },
    {
      id: "5",
      title: "5. Durant quant temps conservem les teves dades?",
      content: `Durant el procés de tramitació:
Les dades transiten per la nostra aplicació web sense emmagatzematge persistent en bases de dades pròpies. El servei de correu electrònic (EmailJS) pot conservar registres tècnics temporalment (7-30 dies) per raons de seguretat i funcionament del servei.

Després de l'enviament:
Les teves dades arriben per correu electrònic al Taller dels Sentits i es conserven el temps necessari per:
- Respondre adequadament a la teva consulta.
- Gestionar el servei que has sol·licitat.
- Complir amb obligacions legals que puguin aplicar.

Eliminació:
Un cop finalitzada la relació i complerts els terminis legals aplicables, procedim a l'eliminació segura de les teves dades. Si exerceixes el teu dret de supressió, eliminarem les teves dades de manera immediata, sempre que no existeixi cap obligació legal que requereixi la seva conservació.`,
    },
    {
      id: "6",
      title: "6. A qui comuniquem les teves dades?",
      content: `Les teves dades poden ser comunicades als següents destinataris:

Encarregats del tractament:
- [EmailJS](https://www.emailjs.com): Servei d'enviament de correus electrònics que actua com a encarregat del tractament. EmailJS compleix amb el RGPD i té certificació de privacitat.
- [Vercel](https://vercel.com): Proveïdor d'allotjament (hosting) de l'aplicació web. Vercel NO emmagatzema dades personals dels formularis, només allotja l'aplicació.

Cap cessió a tercers:
NO cedim, venem ni compartim les teves dades personals amb tercers amb finalitats comercials o publicitàries.

Transferències internacionals:
Els serveis d'EmailJS i Vercel poden emmagatzemar dades en servidors ubicats fora de l'Espai Econòmic Europeu. Aquests proveïdors compleixen amb els mecanismes adequats de protecció de dades reconeguts per la Comissió Europea.`,
    },
    {
      id: "7",
      title: "7. Quins són els teus drets com a usuari?",
      content: `Tens dret a:

Dret d'accés: Obtenir informació sobre si estem tractant les teves dades personals i, en cas afirmatiu, obtenir còpia d'aquestes dades.

Dret de rectificació: Sol·licitar la correcció de dades inexactes o incompletes.

Dret de supressió (dret a l'oblit): Sol·licitar l'eliminació de les teves dades quan ja no siguin necessàries per a les finalitats per les quals van ser recollides.

Dret d'oposició: Oposar-te al tractament de les teves dades personals.

Dret de limitació del tractament: Sol·licitar la limitació del tractament de les teves dades en determinades circumstàncies.

Dret de portabilitat: Rebre les dades que ens has proporcionat en un format estructurat d'ús comú i llegible per màquina, i transmetre-les a un altre responsable.

Dret a retirar el consentiment: Pots retirar el consentiment en qualsevol moment, sense que això afecti la licitud del tractament basat en el consentiment previ a la seva retirada.

Com exercir els teus drets:
Pots exercir aquests drets enviant un correu electrònic a tallerdelssentits@gmail.com, indicant en l'assumpte "Exercici de Drets RGPD" i adjuntant còpia del teu DNI o document equivalent.

Reclamació davant l'autoritat de control:
Si consideres que el tractament de les teves dades personals vulnera la normativa, tens dret a presentar una reclamació davant l'Agència Espanyola de Protecció de Dades (AEPD) a través de la seva [seu electrònica](https://sedeagpd.gob.es) o adreça postal: C/ Jorge Juan, 6, 28001 Madrid.`,
    },
    {
      id: "8",
      title: "8. Mesures de seguretat",
      content: `El Taller dels Sentits aplica mesures tècniques i organitzatives adequades per garantir la seguretat de les teves dades personals i evitar la seva alteració, pèrdua, tractament o accés no autoritzat:

- Validació server-side: Totes les dades del formulari es validen i sanititzen en el servidor abans de ser processades, prevenint atacs d'injecció de codi i altres vulnerabilitats.
- Honeypot anti-bot: Camp invisible que detecta i bloqueja silenciosament l'enviament automatitzat per robots (spam bots).
- Xifratge HTTPS: Tota la comunicació entre el teu navegador i la nostra aplicació està xifrada mitjançant protocol HTTPS.
- Rate limiting: Límits de freqüència d'enviament configurats en EmailJS per prevenir abús del servei.
- Restricció de dominis: Les credencials d'EmailJS només funcionen des del nostre domini oficial, prevenint ús no autoritzat.
- Absència d'emmagatzematge persistent: No mantenim bases de dades amb les teves dades personals, minimitzant riscos de filtracions.`,
    },
    {
      id: "9",
      title: "9. Cookies i tecnologies de seguiment",
      content: `Actualment, aquesta pàgina web NO utilitza cookies de seguiment ni tecnologies similars per recollir informació personal.

Els serveis que utilitzem (EmailJS, Vercel) poden utilitzar cookies tècniques estrictament necessàries per al funcionament del servei, però no emmagatzemen dades personals identificables.

Si en el futur implementem cookies analítiques o d'altres tipus, t'informarem adequadament i sol·licitarem el teu consentiment quan sigui necessari segons la normativa vigent.`,
    },
    {
      id: "10",
      title: "10. Modificacions de la política de privacitat",
      content: `Ens reservem el dret de modificar aquesta política de privacitat per adaptar-la a canvis legislatius, jurisprudencials o en les nostres pràctiques de tractament de dades.

Qualsevol modificació serà publicada en aquesta pàgina amb la seva data d'actualització. Et recomanem revisar periòdicament aquesta política per mantenir-te informat sobre com protegim les teves dades.

En cas de canvis substancials que requereixin el teu consentiment, t'informarem adequadament abans d'aplicar els canvis.`,
    },
    {
      id: "11",
      title: "11. Contacte",
      content: `Per a qualsevol qüestió relacionada amb aquesta política de privacitat o l'exercici dels teus drets, pots contactar amb nosaltres a través de:

Correu electrònic: tallerdelssentits@gmail.com
Telèfon: XXX XXX XXX
Adreça postal: Vilanova i la Geltrú, Barcelona

Estem a la teva disposició per resoldre qualsevol dubte sobre el tractament de les teves dades personals.`,
    },
  ] as PrivacySection[],

  // Fragmento corto para usar cerca del checkbox del formulario
  shortSummary: "Les teves dades s'utilitzaran únicament per respondre a la teva consulta i gestionar el servei sol·licitat. No les cedim a tercers amb finalitats comercials.",
};
