"use client"
import { motion } from 'motion/react';
import { servicesData } from '@/app/_lib/servicesData';
import { QuoteCarousel } from '@/app/(serveis)/components/QuoteCarousel';
import { useServeis } from '@/app/(serveis)/hooks/useServeis';

export default function Artperdins() {
    const quoteIndices = useServeis();
    const service = servicesData.find(s => s.id === 'artperdins')!;

    return (
        <main>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-[#7B8BC7] text-lg sm:text-3xl lg:text-4xl font-light tracking-[0.2em] mb-3 text-center">
                    {service.title}
                </h1>
                
                <p className="text-gray-700 text-base sm:text-xl text-center mb-4 font-light italic">
                    {service.subtitle}
                </p>

                <QuoteCarousel quotes={service.quotes} currentIndex={quoteIndices[service.id]} />
            </div>
        </main>
    );
}
