"use client"
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
import { SectionTabs } from './components';
import CentresIcon from '@/app/_assets/iconos/ARTE/DIBUJO.svg';
import AltresEspaisIcon from '@/app/_assets/iconos/ESPACIO/VENTANA.svg';

export default function ServeisExterns() {
    const service = servicesData.find(s => s.id === 'serveis-externs')!;

    const [selectedTab, setSelectedTab] = useState<'centres' | 'altres'>('centres');

    const sectionTabs = [
        { key: 'centres', label: 'Centres Educatius', icon: CentresIcon.src },
        { key: 'altres',  label: 'Altres Espais',     icon: AltresEspaisIcon.src },
    ];

    const tabIndexMap: Record<string, number> = { centres: 0, altres: 1 };
    const activeSection = service.sections?.[tabIndexMap[selectedTab]];

    return (
        <main className={`${service.bgColor} py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection title={service.title} subtitle={service.subtitle} />

                <RoundHeaderImage src={headerImg} alt="Serveis Externs - Taller dels Sentits" />

                {service.quote && <StaticQuote quote={service.quote} />}

                <SectionTabs
                    tabs={sectionTabs}
                    selectedTab={selectedTab}
                    onTabChange={(key) => setSelectedTab(key as 'centres' | 'altres')}
                />

                <AnimatePresence mode="wait">
                    {activeSection && (
                        <motion.div
                            key={selectedTab}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                        >
                            <FadeInView as="section" className="py-10 space-y-6">
                                <SectionHeading headingLevel="h2" title={activeSection.title} className="text-center mb-4" />

                                {activeSection.paragraphs.length > 0 && (
                                    <ParagraphList paragraphs={activeSection.paragraphs} boldIndex={0} />
                                )}

                                {activeSection.subsections?.map((sub, i) => (
                                    <div key={sub.title} className="space-y-8 pt-6">
                                        <SectionHeading headingLevel="h3" title={sub.title} subtitle={sub.subtitle} />

                                        {sub.paragraphs.length > 0 && (
                                            <ParagraphList paragraphs={sub.paragraphs} boldIndex={0} />
                                        )}

                                        {selectedTab === 'centres' && i === 0 && <ImageCarousel images={carouselImages} />}

                                        {selectedTab === 'centres' && i === 0 && (
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

                                {activeSection.subheading && (
                                    <SubheadingWithList title={activeSection.subheading} list={activeSection.list} />
                                )}
                            </FadeInView>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
