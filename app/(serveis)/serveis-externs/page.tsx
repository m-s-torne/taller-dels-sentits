"use client"
import { servicesData } from '@/app/_lib/servicesData';
// TODO: Substituir per la imatge definitiva de Serveis Externs
import headerImg from './assets/images/taller_dels_sentits_serveis_externs.jpg';
import { HeroSection, StaticQuote } from '@/app/(serveis)/components';
import { ParagraphList } from '@/app/_components/ParagraphList';
import { SectionHeading } from '@/app/_components/SectionHeading';
import { useScrollToTop } from '@/app/_hooks/useScrollToTop';
import { RoundHeaderImage } from '@/app/_components/RoundHeaderImage';
import { motion } from 'motion/react';
import { ImageCarousel } from '../components/ImageCarousel';
import { carouselImages } from './lib/carouselImages';

export default function ServeisExterns() {
    const service = servicesData.find(s => s.id === 'serveis-externs')!;

    useScrollToTop();

    return (
        <main className={`${service.bgColor} py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection title={service.title} subtitle={service.subtitle} />

                <RoundHeaderImage src={headerImg.src} alt="Serveis Externs - Taller dels Sentits" />

                {service.quote && <StaticQuote quote={service.quote} />}

                {service.sections?.map((section) => (
                    <motion.section
                        key={section.title}
                        className="py-10 space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.08 }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionHeading headingLevel="h2" title={section.title} className="text-center mb-4" />
                        
                        <ParagraphList paragraphs={section.paragraphs} boldIndex={0} />

                        {section.subsections?.map((sub, i) => (
                            <div key={sub.title} className="space-y-8 pt-6">
                                <SectionHeading headingLevel="h3" title={sub.title} />
                                {sub.subtitle && (
                                    <p className="text-base sm:text-[15px] lg:text-[20px] font-light">
                                        {sub.subtitle}
                                    </p>
                                )}
                                
                                <ParagraphList paragraphs={sub.paragraphs} boldIndex={0} />
                                
                                { i === 0 && <ImageCarousel images={carouselImages} /> }
                                
                                {sub.subheading && (
                                    <div className="mt-4">
                                        <SectionHeading headingLevel="h3" title={sub.subheading} className="text-xl! sm:text-xl! lg:text-2xl!" />
                                        {sub.list && (
                                            <div className="shadow-thick-shakespeare rounded-[40px] border-4 border-shakespeare px-8 py-10 mt-6">
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[11px] sm:text-base lg:text-lg leading-relaxed list-none">
                                                    {sub.list.map((item, j) => (
                                                        <li key={j} className="flex items-start gap-4">
                                                            <span className="shrink-0">–</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {section.subheading && (
                            <div className="mt-4">
                                <SectionHeading headingLevel="h3" title={section.subheading} className="text-xl! sm:text-xl! lg:text-2xl!" />
                                {section.list && (
                                    <div className="shadow-thick-shakespeare rounded-[40px] border-4 border-shakespeare px-8 py-10 mt-6">
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[11px] sm:text-base lg:text-lg leading-relaxed list-none">
                                            {section.list.map((item, j) => (
                                                <li key={j} className="flex items-start gap-4">
                                                    <span className="shrink-0">–</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.section>
                ))}
            </div>
        </main>
    );
}
