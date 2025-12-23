import { motion } from 'motion/react';
import CorazonIcon from '@/app/_assets/iconos/ESPACIO/CORAZÓN.svg';

interface LongDescriptionProps {
    longDescription: string[];
}

export const LongDescription = ({ longDescription }: LongDescriptionProps) => {

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
        >
            <div className="text-sm sm:text-base lg:text-lg leading-relaxed space-y-4">
                {longDescription.map((paragraph, index) => (
                    <p key={index}>
                        {paragraph.trim()}
                    </p>
                ))}
            </div>
        </motion.section>
    );
};
