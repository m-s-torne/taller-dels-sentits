"use client"
import { servicesData } from '@/app/_lib/servicesData';
import { 
    HeroSection, 
    LongDescription, 
    MoreContentSection, 
    QuestionsSection,
    DisclaimerSection,
    ReviewsSection,
    StaticQuote,
} from '@/app/(serveis)/components';
import {
    RestArtterapia,
} from './components';
import { carouselImages } from '@/app/(serveis)/artterapia/lib/carouselImages';
import { ImageCarousel } from '@/app/(serveis)/components/ImageCarousel';

export default function Artterapia() {
    const service = servicesData[0]; // artterapia
    const rilkeQuote = {
        text: "Tingueu paciència amb tot allò que no està resolt en el vostre cor i intenteu estimar-ne les preguntes",
        author: "Rainer Maria Rilke. Poeta"
    };

    return (
        <main className={`${service.bgColor} md:py-14 py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection service={service} />

                <StaticQuote quote={rilkeQuote} />

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
