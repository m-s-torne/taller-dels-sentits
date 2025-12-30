import type { Metadata } from 'next';
import { legalData, legalSummary } from './lib/legalData';
import { RenderTextWithLinks } from '@/app/_lib/renderTextWithLinks';

export const metadata: Metadata = {
  title: 'Avís Legal - Taller dels Sentits',
  description: 'Avís Legal del lloc web de Taller dels Sentits. Informació sobre el responsable del lloc web, condicions d\'ús, propietat intel·lectual i legislació aplicable.',
};

export default function AvisLegalPage() {
  return (
    <main className="min-h-screen bg-lilac">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-midnight mb-4">
            Avís Legal
          </h1>
          <p className="text-sm text-scampi">
            Última actualització: desembre de 2025
          </p>
        </header>

        {/* Introducción */}
        <section className="mb-12 p-6 bg-white rounded-lg shadow-md border-l-4 border-violet-blue">
          <p className="text-lg text-midnight leading-relaxed">
            {legalSummary}
          </p>
        </section>

        {/* Secciones */}
        <div className="space-y-10">
          {legalData.map((section) => (
            <section 
              key={section.id}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-jacarta mb-6">
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

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-white/70 rounded-lg shadow-sm">
          <p className="text-sm text-scampi text-center">
            Aquest Avís Legal és efectiu des de desembre de 2025 i pot ser modificat sense previ avís. 
            Es recomana revisar-lo periòdicament per estar informat de qualsevol canvi.
          </p>
        </div>
      </div>
    </main>
  );
}
