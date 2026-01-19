'use client'
import { useState, useEffect } from 'react';
import type { Question } from '@/app/_types/services.types';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionCarouselProps {
    questions: Question[];
}

export const QuestionCarousel = ({ questions }: QuestionCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (questions.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [questions.length]);

    if (questions.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
        >
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
        </motion.section>
    );
};
