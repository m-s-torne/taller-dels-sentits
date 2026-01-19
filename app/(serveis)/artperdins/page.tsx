"use client"
import { servicesData } from '@/app/_lib/servicesData';
import { 
    HeroSection,
    DisclaimerSection, 
    LongDescription, 
    MoreContentSection, 
    QuestionsSection, 
    ReviewsSection,
    StaticQuote,
} from '@/app/(serveis)/components';
import { RestArtperDins } from './components/RestArtperdins';
import { ImageCarousel } from '@/app/(serveis)/components/ImageCarousel';
import { carouselImages1, carouselImages2 } from './lib/carouselImages';

export default function Artperdins() {
    const service = servicesData.find(s => s.id === 'artperdins')!;
    const celayaQuote = {
        text: "Perquè la bellesa transforma, és una arma carregada de futur.",
        author: "Gabriel Celaya. Poeta"
    };

    return (
        <main className={`${service.bgColor} md:py-14 py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection service={service}/>

                <StaticQuote quote={celayaQuote} />

                <p className="font-bold lg:text-lg text-sm">{service.exclamation}</p>

                <LongDescription longDescription={service.longDescription} />

                <ImageCarousel images={carouselImages1} />

                <QuestionsSection questions={service.questions}/>

                <MoreContentSection moreContent={service.moreContent} />

                <RestArtperDins rest={service.rest}/>

                <ImageCarousel images={carouselImages2} />

                <DisclaimerSection disclaimer={service.disclaimer}/>

                <ReviewsSection reviews={service.reviews!}/>
            </div>
        </main>
    );
}
