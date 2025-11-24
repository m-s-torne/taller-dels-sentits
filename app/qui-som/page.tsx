export default function QuiSom () {
    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto mt-5 sm:mt-15 px-4 py-22 sm:py-16 lg:py-30">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#7B8BC7] text-center mb-10 md:mb-15">
                    Qui Som?
                </h1>
                
                {/* Sección Historia del Proyecto */}
                <div className="max-w-4xl mx-auto space-y-8 text-gray-700 text-sm sm:text-lg leading-relaxed">
                    {/* Introducción ArtSalut */}
                    <section className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#7B8BC7] mb-6">
                            El Taller dels Sentits: 30 anys de trajectòria fent ArtSalut
                        </h2>
                        <p>
                            Amb aquest terme el poeta Enric Casasses definia en una entrevista una de les seves 
                            "raons" d'escriure i vaig sentir que m'anava com l'anell al dit per explicar el treball que 
                            hem estat realitzant durant aquests anys i que encara m'anava millor per subratllar 
                            aquesta nova etapa del Taller dels Sentits centrada en l'Artteràpia i l'Acompanyament 
                            Creatiu.
                        </p>
                    </section>

                    {/* D'on venim */}
                    <section className="space-y-6 mt-12">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-[#7B8BC7] mb-6">
                            D'on venim….
                        </h3>
                        <p>
                            El Taller dels Sentits va nèixer com un projecte pedagògic per la necessitat de portar a la 
                            pràctica una metodologia de les arts plàstiques propera, respectuosa i atenta a les 
                            necessitats expressives i creatives dels infants, més enllà de conceptes estètics establerts 
                            i que a poc a poc, amb els anys, acaba configurant un marc propi d'acció i, des d'aquest, 
                            amplia serveis a adolescents, joves i adults. Durant aquest temps, els nostres plans 
                            d'actuació també traspassen les nostres aules amb el projecte pedagògic per a les 
                            escoles anomenat "Aprendre a mirar un Quadre", així com també formacions al 
                            professorat.
                        </p>
                        <p>
                            Saber com Acompanyar les persones, des del material sensible que es desplega, em 
                            porta a formar-me durant tots aquets anys en diversos postgraus i màsters d'Artteràpia i, 
                            des d'ells, s'integren nous recursos i eines a les aules del Taller que fan que, a poc a poc, 
                            la relació entre Art i Salut acabi configurant una línia clara d'actuació dins i fora del nostre 
                            espai portant a terme sessions individuals i grupals, projectes artterapèutics com el del 
                            CAP de Les Roquetes destinat a persones que tenen a càrrec familiars diagnosticats amb 
                            Alzheimer; el projecte pels serveis socials del Consell Comarcal del Garraf destinat a 
                            persones a càrrec de menors amb diagnòstic TEA; o el realitzat per a residències i centres 
                            de dia "Guardar la Vida" per l'Ajuntament de Vilanova i la Geltrú i la Diputació de 
                            Barcelona.
                        </p>
                        <p>
                            Durant tots aquests anys, he pogut experimentar l'eficàcia dels llenguatges artístics per 
                            inserir en la qualitat del viure de les persones, i també com un Acompanyament acurat i 
                            respectuós pot ajudar a l'expressió de l'àmbit emocional i al desplegament d'una 
                            Simbolització inherent a la persona que fa que els propis recursos reguladors i resolutius 
                            es mobilitzin davant de les dificultats emocionals, físiques, psicològiques o socials i que 
                            poden incidir de forma clara en la salut de la persona.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
};
