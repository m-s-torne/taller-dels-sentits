"use client"
import { servicesData } from '@/app/_lib/servicesData';
import headerImg from './assets/images/taller_dels_sentits_capçalera_artperdins.jpg';
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

export default function Artperdins() {
    const service = servicesData.find(s => s.id === 'artperdins')!;

    return (
        <main className={`${service.bgColor} md:py-14 py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection service={service}/>

                <div className="flex justify-center mb-8">
                    <img
                        className="w-50 h-50 sm:w-62 sm:h-62 md:w-85 md:h-85 object-cover rounded-full shadow-lg"
                        src={headerImg.src}
                        alt="Artperdins - Taller dels Sentits"
                    />
                </div>

                {service.quote && <StaticQuote quote={service.quote} />}

                <p className="font-bold lg:text-lg text-sm">{service.exclamation}</p>

                <LongDescription longDescription={service.longDescription} />

                <ImageCarousel images={carouselImages1} />

                <QuestionCarousel questions={service.questions}/>


                <RestArtperDins rest={service.rest}/>

                <ImageCarousel images={carouselImages2} />


                <MoreContentSection moreContent={service.moreContent} />

                <ReviewsSection reviews={service.reviews!}/>
                
                <DisclaimerSection disclaimer={service.disclaimer}/>
            </div>
        </main>
    );
}
