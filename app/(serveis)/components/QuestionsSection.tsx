'use client'
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QuestionCarousel } from './QuestionCarousel';
import type { Question } from '@/app/_types/services.types';

interface QuestionsSectionProps {
    questions: Question[];
}

export const QuestionsSection = ({ questions }: QuestionsSectionProps) => {
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
            <QuestionCarousel questions={questions} currentIndex={currentIndex} />
        </motion.section>
    );
};
