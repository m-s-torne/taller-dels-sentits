"use client"
import { useState, useRef } from 'react';
import { contentData } from '@/app/(home)/lib/contentData';

export const useContentSection = () => {
    const [selectedStep, setSelectedStep] = useState('sentir');
    const [isScrolledDown, setIsScrolledDown] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

    const currentContent = contentData[selectedStep as keyof typeof contentData];

    // Procesar título con palabras en negrita
    const renderTitle = () => {
        return currentContent.title;
    };

    // Procesar párrafos de texto
    const renderTextParagraphs = () => {
        return currentContent.text.split('\n\n').map((paragraph, index) => (
            <p key={index} className={`${index > 0 ? "mt-4" : ""} text-lilac!`}>
                {paragraph}
            </p>
        ));
    };

    // Estilos calculados
    const triangleRotation = isScrolledDown ? 'rotate(180deg)' : 'rotate(0deg)';

    const handleArrowClick = () => {
        if (textRef.current) {
            if (isScrolledDown) {
                // Scroll hacia arriba
                textRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                setIsScrolledDown(false);
            } else {
                // Scroll hacia abajo
                textRef.current.scrollTo({
                    top: textRef.current.scrollHeight,
                    behavior: 'smooth'
                });
                setIsScrolledDown(true);
            }
        }
    };

    const handleStepChange = (stepKey: string) => {
        setSelectedStep(stepKey);
        setIsScrolledDown(false); // Reset scroll state
        // Reset scroll position
        if (textRef.current) {
            textRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return {
        selectedStep,
        currentContent,
        textRef,
        triangleRotation,
        renderTitle,
        renderTextParagraphs,
        handleArrowClick,
        handleStepChange
    };
};
