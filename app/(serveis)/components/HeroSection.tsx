import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { SectionHeading } from '@/app/_components/SectionHeading';

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

interface HeroSectionProps {
    title: string;
    subtitle: string;
}

export const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center md:mb-5 mb-10"
        >
            <motion.div variants={itemVariants}>
                <SectionHeading headingLevel="h1" title={title} />
            </motion.div>

            <motion.p variants={itemVariants} className="text-base sm:text-[15px] lg:text-[20px] font-light mx-auto">
                {subtitle}
            </motion.p>
        </motion.div>
    );
};
