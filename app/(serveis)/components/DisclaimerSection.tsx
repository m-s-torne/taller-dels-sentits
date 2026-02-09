import { motion } from 'motion/react';

interface DisclaimerSectionProps {
    disclaimer: string[];
}

export const DisclaimerSection = ({ disclaimer }: DisclaimerSectionProps) => {
    if (!disclaimer || disclaimer.length === 0) return null;

    const [firstSentence, ...restSentences] = disclaimer;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
        >
            {/* Primera frase fuera del container */}
            <p className="text-shakespeare! text-xs sm:text-sm leading-relaxed mb-4">
                {firstSentence.trim()}
            </p>
            
            {/* Resto de frases dentro del container */}
            {restSentences.length > 0 && (
                <div className="bg-shakespeare/10 border-l-4 border-shakespeare p-5 rounded-r-lg">
                    {restSentences.map((sentence, index) => (
                        <p key={index} className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">
                            {sentence.trim()}
                        </p>
                    ))}
                </div>
            )}
        </motion.section>
    );
};
