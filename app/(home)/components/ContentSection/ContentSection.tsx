"use client"
import './ContentSection.css';
import { contentSteps } from '@/app/(home)/lib/steps';
import { useContentSection } from '@/app/(home)/hooks/useContentSection';
import ContentDisplay from './ContentDisplay';
import StepsNavigation from './StepsNavigation';
import { motion } from 'motion/react';

export const ContentSection = () => {
    const {
        selectedStep,
        currentContent,
        textRef,
        triangleRotation,
        renderTitle,
        renderTextParagraphs,
        handleArrowClick,
        handleStepChange
    } = useContentSection();

    return (
        <motion.section 
            id="essencia" 
            className="bg-shakespeare py-20 px-4 sm:px-6 md:px-10 overflow-x-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-0 lg:gap-16">
                {/* Contenido principal centrado */}
                <ContentDisplay 
                    currentContent={currentContent}
                    textRef={textRef}
                    triangleRotation={triangleRotation}
                    renderTitle={renderTitle}
                    renderTextParagraphs={renderTextParagraphs}
                    handleArrowClick={handleArrowClick}
                />

                {/* Navegación vertical a la derecha */}
                <StepsNavigation 
                    steps={contentSteps}
                    selectedStep={selectedStep}
                    handleStepChange={handleStepChange}
                />
            </div>
        </motion.section>
    );
};
