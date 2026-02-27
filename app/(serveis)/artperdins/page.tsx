"use client"
import { servicesData } from '@/app/_lib/servicesData';
import headerImg from './assets/images/taller_dels_sentits_capçalera_artperdins.jpg';
import arbre from './assets/images/arbre.jpg';
import escultura from './assets/images/escultura.jpg';
import { 
    HeroSection,
    DisclaimerSection, 
    LongDescription, 
    MoreContentSection, 
    QuestionCarousel, 
    ReviewsSection,
    StaticQuote,
} from '@/app/(serveis)/components';
import { RestArtperDins } from './components/RestArtperdins';
import { ImageCarousel } from '@/app/(serveis)/components/ImageCarousel';
import { carouselImages1, carouselImages2 } from './lib/carouselImages';
import { useScrollToTop } from '@/app/_hooks/useScrollToTop';
import { RoundHeaderImage } from '@/app/_components/RoundHeaderImage';

export default function Artperdins() {
    const service = servicesData.find(s => s.id === 'artperdins')!;

    useScrollToTop();

    return (
        <main className={`${service.bgColor} py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection title={service.title} subtitle={service.subtitle} />

                <RoundHeaderImage src={headerImg.src} alt="Artperdins - Taller dels Sentits" />

                {service.quote && <StaticQuote quote={service.quote} />}

                <p className="font-bold lg:text-lg text-sm">{service.exclamation}</p>

                <LongDescription longDescription={service.longDescription} />

                <QuestionCarousel questions={service.questions}/>
                
                <ImageCarousel images={carouselImages1} />

                <RestArtperDins rest={service.rest}/>

                <ImageCarousel images={carouselImages2} />

                <MoreContentSection 
                    moreContent={service.moreContent}
                    images={[
                        { src: arbre.src, alt: 'Pintura arbre' },
                        { src: escultura.src, alt: 'Escultura' }
                    ]}
                />

                <ReviewsSection reviews={service.reviews!}/>
                
                <DisclaimerSection disclaimer={service.disclaimer}/>
            </div>
        </main>
    );
}
