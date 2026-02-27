import { motion } from 'motion/react';
import { SectionHeading } from '@/app/_components/SectionHeading';

interface HeroSectionProps {
    title: string;
    subtitle: string;
}

export const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center md:mb-5 mb-10"
        >
            <SectionHeading headingLevel="h1" title={title} />
            
            <p className="text-base sm:text-[15px] lg:text-[20px] font-light mx-auto">
                {subtitle}
            </p>
        </motion.div>
    );
};
