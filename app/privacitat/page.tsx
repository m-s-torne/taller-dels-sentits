import { privacyData } from './lib/privacyData';
import type { Metadata } from 'next';
import { RenderTextWithLinks } from '@/app/_lib/renderTextWithLinks';

export const metadata: Metadata = {
  title: "Política de Privacitat - Taller dels Sentits",
  description: "Política de privacitat i protecció de dades personals del Taller dels Sentits. Coneix com tractem les teves dades segons el RGPD.",
};

export default function PrivacitatPage() {
  return (
    <main className="min-h-screen bg-lilac">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-midnight mb-4">
            Política de Privacitat
          </h1>
          <p className="text-sm text-scampi!">
            Última actualització: {privacyData.meta.lastUpdate}
          </p>
          <p className="text-sm text-scampi!">
            Versió: {privacyData.meta.version}
          </p>
        </header>

        {/* Introducción */}
        <section className="mb-12 p-6 bg-white rounded-lg shadow-md border-l-4 border-violet-blue">
          <p className="text-lg text-midnight leading-relaxed">
            En el <strong>Taller dels Sentits</strong>, ens prenem seriosament la protecció de les teves dades personals. 
            Aquesta política de privacitat explica com recollim, utilitzem i protegim la informació que ens proporciones 
            a través del nostre formulari de contacte, en compliment del <strong>Reglament General de Protecció de Dades (RGPD)</strong> 
            i la <strong>Llei Orgànica 3/2018 de Protecció de Dades Personals i garantia dels drets digitals (LOPDGDD)</strong>.
          </p>
        </section>

        {/* Secciones */}
        <div className="space-y-10">
          {privacyData.sections.map((section) => (
            <section 
              key={section.id}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-jacarta! mb-6">
                {section.title}
              </h2>
              
              {Array.isArray(section.content) ? (
                <ul className="space-y-4">
                  {section.content.map((item, index) => (
                    <li 
                      key={index} 
                      className="text-midnight leading-relaxed pl-6 border-l-2 border-shakespeare"
                    >
                      <RenderTextWithLinks text={item} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-midnight leading-relaxed whitespace-pre-line prose prose-lg max-w-none">
                  <RenderTextWithLinks text={section.content} />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Footer de la página de privacidad */}
        <footer className="mt-16 pt-8 border-t-2 border-scampi/20">
          <div className="bg-violet-blue/10 p-6 rounded-lg">
            <p className="text-midnight text-center font-semibold mb-2">
              Tens alguna pregunta sobre aquesta política?
            </p>
            <p className="text-midnight text-center">
              Contacta amb nosaltres a <RenderTextWithLinks text={privacyData.responsable.email} />
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
