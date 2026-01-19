import type { Question } from '@/app/_types/services.types';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionCarouselProps {
    questions: Question[];
    currentIndex: number;
}

export const QuestionCarousel = ({ questions, currentIndex }: QuestionCarouselProps) => {
    if (questions.length === 0) return null;

    return (
        <div className="relative h-35 pt-5 mb-4 md:mb-6 flex items-start justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute w-full text-center px-8"
                >
                    <p className="text-shakespeare! text-base sm:text-xl font-light italic mb-2 leading-relaxed">
                        "{questions[currentIndex].text}"
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
