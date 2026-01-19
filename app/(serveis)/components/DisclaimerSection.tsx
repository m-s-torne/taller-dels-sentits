import { motion } from 'motion/react';

interface DisclaimerSectionProps {
    disclaimer: string;
}

export const DisclaimerSection = ({ disclaimer }: DisclaimerSectionProps) => {
    if (!disclaimer || !disclaimer.trim()) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
        >
            <div className="bg-shakespeare/10 border-l-4 border-shakespeare p-5 rounded-r-lg">
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">
                    {disclaimer.trim()}
                </p>
            </div>
        </motion.section>
    );
};
