export interface LegalSection {
  id: string;
  title: string;
  content: string | string[];
}

export const legalData: LegalSection[] = [
  {
    id: "identificacio",
    title: "1. Identificació del Responsable",
    content: [
      "En compliment de la Llei 34/2002, de 11 de juliol, de Serveis de la Societat de la Informació i de Comerç Electrònic (LSSI), s'informa que:",
      "Titular: [Nom i Cognoms del/de la Titular]",
      "NIF: XXXXXXXXX",
      "Domicili Professional: Vilanova i la Geltrú, Barcelona",
      "Correu Electrònic: tallerdelssentits@gmail.com",
      "Telèfon: XXX XXX XXX",
      "Nom Comercial: Taller dels Sentits"
    ]
  },
  {
    id: "objecte",
    title: "2. Objecte i Activitat",
    content: [
      "Aquest lloc web ofereix informació sobre els serveis d'artteràpia, tallers creatius (Artperdins) i programes per a centres educatius que ofereix Taller dels Sentits.",
      "L'activitat principal és la prestació de serveis terapèutics i creatius mitjançant l'art, així com l'acompanyament emocional a persones, grups i comunitats educatives."
    ]
  },
  {
    id: "condicions-us",
    title: "3. Condicions d'Ús",
    content: [
      "L'accés i ús d'aquest lloc web atorga la condició d'usuari i implica l'acceptació d'aquest Avís Legal.",
      "L'usuari es compromet a fer un ús adequat dels continguts i serveis que s'ofereixen en aquest lloc web, d'acord amb la llei, la moral, els bons costums i l'ordre públic.",
      "Queda prohibit l'ús del lloc web amb finalitats il·lícites o lesives, o que de qualsevol forma puguin causar perjudici o impedir el normal funcionament del lloc web."
    ]
  },
  {
    id: "propietat-intel·lectual",
    title: "4. Propietat Intel·lectual i Industrial",
    content: [
      "Tots els continguts d'aquest lloc web (textos, imatges, marques, gràfics, logotips, botons, arxius de programari, combinacions de colors, així com l'estructura, selecció, ordenació i presentació dels seus continguts) estan protegits per drets de propietat intel·lectual i industrial.",
      "Queda prohibida la reproducció, distribució, comunicació pública i transformació dels continguts sense autorització expressa del titular, excepte per a ús personal i privat."
    ]
  },
  {
    id: "limitacio-responsabilitat",
    title: "5. Limitació de Responsabilitat",
    content: [
      "Taller dels Sentits no es fa responsable de:",
      "• La disponibilitat tècnica del lloc web",
      "• Errors o omissions en els continguts",
      "• La manca de veracitat, exactitud, exhaustivitat i/o actualització dels continguts",
      "• Danys i perjudicis que puguin derivar-se de l'ús del lloc web o dels seus continguts",
      "Taller dels Sentits es reserva el dret a modificar els continguts del lloc web sense previ avís."
    ]
  },
  {
    id: "links",
    title: "6. Enllaços Externs",
    content: [
      "Aquest lloc web pot contenir enllaços a llocs web de tercers. Taller dels Sentits no exerceix cap control sobre aquests llocs i, per tant, no es fa responsable dels seus continguts.",
      "L'usuari accedeix a aquests enllaços sota la seva pròpia responsabilitat."
    ]
  },
  {
    id: "modificacions",
    title: "7. Modificacions",
    content: "Taller dels Sentits es reserva el dret a modificar el present Avís Legal en qualsevol moment. Els usuaris estan subjectes a la versió publicada en cada moment que accedeixin al lloc web."
  },
  {
    id: "legislacio",
    title: "8. Legislació Aplicable i Jurisdicció",
    content: [
      "Aquest Avís Legal es regeix per la legislació espanyola vigent.",
      "Per a la resolució de qualsevol controvèrsia que pugui sorgir en relació amb aquest lloc web i les seves activitats, les parts se sotmeten als Jutjats i Tribunals de Vilanova i la Geltrú (Barcelona)."
    ]
  },
  {
    id: "contacte",
    title: "9. Contacte",
    content: [
      "Per a qualsevol qüestió relacionada amb aquest Avís Legal, pot posar-se en contacte amb nosaltres a través de:",
      "Correu electrònic: tallerdelssentits@gmail.com",
      "Última actualització: desembre de 2025"
    ]
  }
];

export const legalSummary = "Aquest lloc web ofereix informació sobre serveis d'artteràpia i tallers creatius. L'ús del lloc implica l'acceptació de les condicions establertes en aquest Avís Legal.";
