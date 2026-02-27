"use client"
import { servicesData } from '@/app/_lib/servicesData';
import headerImg from './assets/images/taller_dels_sentits_capçalera_centres.jpg';
import angel1 from '../artterapia/assets/images/angel_1.jpg';
import angel2 from '../artterapia/assets/images/angel_2.jpg';
import { HeroSection, LongDescription, MoreContentSection, StaticQuote } from '@/app/(serveis)/components';
import { RestCentres } from './components/RestCentres';
import { useScrollToTop } from '@/app/_hooks/useScrollToTop';
import { RoundHeaderImage } from '@/app/_components/RoundHeaderImage';

export default function Centres() {
    const service = servicesData.find(s => s.id === 'centres-educatius')!;

    useScrollToTop();

    return (
        <main className={`${service.bgColor} py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection title={service.title} subtitle={service.subtitle} />

                <RoundHeaderImage src={headerImg.src} alt="Centres Educatius - Taller dels Sentits" />

                {service.quote && <StaticQuote quote={service.quote} />}

                <LongDescription longDescription={service.longDescription} />

                <MoreContentSection 
                    moreContent={service.moreContent}
                    images={[
                        { src: angel1.src, alt: 'Àngel 1' },
                        { src: angel2.src, alt: 'Àngel 2' }
                    ]}
                />

                <RestCentres rest={service.rest}/>
            </div>
        </main>
    );
}
