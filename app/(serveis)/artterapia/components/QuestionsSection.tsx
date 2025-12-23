import { motion } from 'motion/react';

interface QuestionsSectionProps {
    questions: string[];
}

export const QuestionsSection = ({ questions }: QuestionsSectionProps) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-8">
                {questions.map((question, index) => (
                    <p 
                        key={index}
                        className="text-shakespeare! font-light text-sm sm:text-base lg:text-lg leading-relaxed text-center"
                    >
                        {question.trim()}
                    </p>
                ))}
            </div>
        </motion.section>
    );
};
