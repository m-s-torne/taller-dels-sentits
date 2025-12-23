import { motion } from 'motion/react';
import type { ServiceSectionType } from '@/app/_types/services.types';

interface HeroSectionProps {
    service: ServiceSectionType;
}

export const HeroSection = ({ service }: HeroSectionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-7"
        >
            <h1 className="text-shakespeare! text-3xl sm:text-4xl lg:text-6xl font-light tracking-[0.2em] mb-6">
                {service.title}
            </h1>
            
            <p className="text-base sm:text-[15px] lg:text-[20px] font-light mx-auto">
                {service.subtitle}
            </p>
        </motion.div>
    );
};
