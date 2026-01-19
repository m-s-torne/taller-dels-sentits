"use client"
import { servicesData } from '@/app/_lib/servicesData';
import headerImg from './assets/images/taller_dels_sentits_capçalera_centres.jpg';
import { HeroSection, LongDescription, MoreContentSection, StaticQuote } from '@/app/(serveis)/components';
import { RestCentres } from './components/RestCentres';

export default function Centres() {
    const service = servicesData.find(s => s.id === 'centres-educatius')!;

    return (
        <main className={`${service.bgColor} md:py-14 py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection service={service} />

                <div className="flex justify-center mb-8">
                    <img
                        className="w-50 h-50 sm:w-62 sm:h-62 md:w-85 md:h-85 object-cover rounded-full shadow-lg"
                        src={headerImg.src}
                        alt="Centres Educatius - Taller dels Sentits"
                    />
                </div>

                {service.quote && <StaticQuote quote={service.quote} />}

                <LongDescription longDescription={service.longDescription} />

                <MoreContentSection moreContent={service.moreContent}/>

                <RestCentres rest={service.rest}/>
            </div>
        </main>
    );
}
