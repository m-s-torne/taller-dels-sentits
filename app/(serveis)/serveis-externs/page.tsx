"use client"
import { servicesData } from '@/app/_lib/servicesData';
// TODO: Substituir per la imatge definitiva de Serveis Externs
import headerImg from './assets/images/taller_dels_sentits_serveis_externs.jpg';
import { HeroSection, StaticQuote, SubheadingWithList } from '@/app/(serveis)/components';
import { ParagraphList } from '@/app/_components/ParagraphList';
import { SectionHeading } from '@/app/_components/SectionHeading';
import { RoundHeaderImage } from '@/app/_components/RoundHeaderImage';
import { FadeInView } from '@/app/_components/FadeInView';
import { ImageCarousel } from '../components';
import { carouselImages } from './lib/carouselImages';
import ButtonComponent from '@/app/_components/ui/ButtonComponent';

export default function ServeisExterns() {
    const service = servicesData.find(s => s.id === 'serveis-externs')!;

    return (
        <main className={`${service.bgColor} py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection title={service.title} subtitle={service.subtitle} />

                <RoundHeaderImage src={headerImg} alt="Serveis Externs - Taller dels Sentits" />

                {service.quote && <StaticQuote quote={service.quote} />}

                {service.sections?.map((section) => (
                    <FadeInView key={section.title} as="section" className="py-10 space-y-6">
                        <SectionHeading headingLevel="h2" title={section.title} className="text-center mb-4" />
                        
                        {section.paragraphs.length > 0 && (
                            <ParagraphList paragraphs={section.paragraphs} boldIndex={0} />
                        )}

                        {section.subsections?.map((sub, i) => (
                            <div key={sub.title} className="space-y-8 pt-6">
                                <SectionHeading headingLevel="h3" title={sub.title} subtitle={sub.subtitle} />
                                
                                {sub.paragraphs.length > 0 && (
                                    <ParagraphList paragraphs={sub.paragraphs} boldIndex={0} />
                                )}
                                
                                { i === 0 && <ImageCarousel images={carouselImages} /> }

                                { i === 0 && (
                                    <div className="flex justify-center pb-8">
                                        <ButtonComponent
                                            text="Descarregar PDF"
                                            href="/pdfs/centres-educatius.pdf"
                                            download="Taller-dels-Sentits-Centres-Educatius.pdf"
                                        />
                                    </div>
                                )}
                                
                                {sub.subheading && (
                                    <SubheadingWithList title={sub.subheading} list={sub.list} objectList={sub.objectList} />
                                )}
                            </div>
                        ))}

                        {section.subheading && (
                            <SubheadingWithList title={section.subheading} list={section.list} />
                        )}
                    </FadeInView>
                ))}
            </div>
        </main>
    );
}
