"use client"
import { servicesData } from '@/app/_lib/servicesData';
import { QuoteCarousel } from '@/app/(serveis)/components/QuoteCarousel';
import { useServeis } from '@/app/(serveis)/hooks/useServeis';
import { 
    HeroSection, 
    LongDescription, 
    MoreContentSection, 
    QuestionsSection,
    DisclaimerSection,
    ReviewsSection,
} from '@/app/(serveis)/components';
import {
    RestArtterapia,
} from './components';
import { carouselImages } from '@/app/(serveis)/artterapia/lib/carouselImages';
import { ImageCarousel } from '@/app/(serveis)/components/ImageCarousel';

export default function Artterapia() {
    const quoteIndices = useServeis();
    const service = servicesData[0]; // artterapia

    return (
        <main className={`${service.bgColor} py-20 px-4 sm:px-6 md:px-10 mt-20 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection service={service} />

                <QuoteCarousel quotes={service.quotes} currentIndex={quoteIndices[service.id]} />

                <LongDescription longDescription={service.longDescription} />

                <QuestionsSection questions={service.questions} />

                <ImageCarousel images={carouselImages} />

                <MoreContentSection moreContent={service.moreContent} />

                <RestArtterapia rest={service.rest!} />

                <DisclaimerSection disclaimer={service.disclaimer} />

                <ReviewsSection reviews={service.reviews!} />
            </div>
        </main>
    );
}
