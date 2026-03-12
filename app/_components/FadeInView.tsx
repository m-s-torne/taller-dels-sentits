"use client"
import { motion } from 'motion/react';

interface FadeInViewProps {
    as?: 'div' | 'section';
    className?: string;
    children: React.ReactNode;
}

export function FadeInView({ as = 'div', className, children }: FadeInViewProps) {
    const MotionTag = as === 'section' ? motion.section : motion.div;

    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.6 }}
        >
            {children}
        </MotionTag>
    );
}
