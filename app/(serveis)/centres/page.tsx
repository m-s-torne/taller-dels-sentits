"use client"
import { servicesData } from '@/app/_lib/servicesData';
import { HeroSection, LongDescription, MoreContentSection } from '@/app/(serveis)/components';
import { RestCentres } from './components/RestCentres';

export default function Centres() {
    const service = servicesData.find(s => s.id === 'centres-educatius')!;

    return (
        <main className={`${service.bgColor} md:py-14 py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <HeroSection service={service} />

                <LongDescription longDescription={service.longDescription} />

                <MoreContentSection moreContent={service.moreContent}/>

                <RestCentres rest={service.rest}/>
            </div>
        </main>
    );
}
