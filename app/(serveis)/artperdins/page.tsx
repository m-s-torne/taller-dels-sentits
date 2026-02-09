"use client"
import { servicesData } from '@/app/_lib/servicesData';
import headerImg from './assets/images/taller_dels_sentits_capçalera_artperdins.jpg';
import angel1 from '../artterapia/assets/images/angel_1.jpg';
import angel2 from '../artterapia/assets/images/angel_2.jpg';
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

export default function Artperdins() {
    const service = servicesData.find(s => s.id === 'artperdins')!;

    useScrollToTop();

    return (
        <main className={`${service.bgColor} py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection service={service}/>

                <div className="flex justify-center md:mb-5 mb-10">
                    <img
                        className="w-50 h-50 sm:w-62 sm:h-62 md:w-85 md:h-85 object-cover rounded-full shadow-lg"
                        src={headerImg.src}
                        alt="Artperdins - Taller dels Sentits"
                    />
                </div>

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
                        { src: angel1.src, alt: 'Àngel 1' },
                        { src: angel2.src, alt: 'Àngel 2' }
                    ]}
                />

                <ReviewsSection reviews={service.reviews!}/>
                
                <DisclaimerSection disclaimer={service.disclaimer}/>
            </div>
        </main>
    );
}
