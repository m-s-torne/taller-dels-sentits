"use client"
import { servicesData } from '@/app/_lib/servicesData';
import headerImg from './assets/images/taller_dels_sentits_capçalera_artterapia.jpg';
import { 
    HeroSection, 
    LongDescription, 
    MoreContentSection, 
    QuestionCarousel,
    DisclaimerSection,
    ReviewsSection,
    StaticQuote,
} from '@/app/(serveis)/components';
import {
    RestArtterapia,
} from './components';
import { carouselImages } from '@/app/(serveis)/artterapia/lib/carouselImages';
import { ImageCarousel } from '@/app/(serveis)/components/ImageCarousel';
import { useScrollToTop } from '@/app/_hooks/useScrollToTop';

export default function Artterapia() {
    const service = servicesData[0]; // artterapia

    useScrollToTop();

    return (
        <main className={`${service.bgColor} py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection service={service} />

                <div className="flex justify-center md:mb-5 mb-10">
                    <img
                        className="w-50 h-50 sm:w-62 sm:h-62 md:w-85 md:h-85 object-cover rounded-full shadow-lg"
                        src={headerImg.src}
                        alt="Artteràpia - Taller dels Sentits"
                    />
                </div>

                {service.quote && <StaticQuote quote={service.quote} />}

                <LongDescription longDescription={service.longDescription} />
                
                <RestArtterapia rest={service.rest!} />

                <QuestionCarousel questions={service.questions} />

                <ImageCarousel images={carouselImages} />

                <MoreContentSection moreContent={service.moreContent} />
                
                <ReviewsSection reviews={service.reviews!} />
                
                <DisclaimerSection disclaimer={service.disclaimer} />
            </div>
        </main>
    );
}
