"use client"
import { motion } from 'motion/react';
import { QuoteCarousel } from './QuoteCarousel';
import { serviceContents } from './ServiceContents';
import type { ServiceSectionType } from '@/app/_types/services.types';
import { useServeis } from '@/app/serveis/hooks/useServeis';

interface ServiceSectionProps {
    service: ServiceSectionType;
}

export const ServiceSection = ({ service }: ServiceSectionProps) => {
    const quoteIndices = useServeis();
    const ContentComponent = serviceContents[service.contentKey];

    return (
        <motion.section
            id={service.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: service.delay }}
            className={`${service.bgColor} py-20 px-4 sm:px-6 md:px-10 scroll-mt-24 overflow-x-hidden`}
        >
            <div className="max-w-5xl mx-auto">
                <h2 className="text-[#7B8BC7] text-lg sm:text-3xl lg:text-4xl font-light tracking-[0.2em] mb-3 text-center">
                    {service.title}
                </h2>
                
                <p className="text-gray-700 text-base sm:text-xl text-center mb-4 font-light italic">
                    {service.subtitle}
                </p>

                <QuoteCarousel quotes={service.quotes} currentIndex={quoteIndices[service.id]} />

                <ContentComponent />
            </div>
        </motion.section>
    );
};
