import { useState, useEffect } from 'react';

export const useImageCarousel = (imagesLength: number) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [transitionCount, setTransitionCount] = useState(0);

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? imagesLength - 1 : prev - 1));
        setTransitionCount(prev => prev + 1);
    };

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === imagesLength - 1 ? 0 : prev + 1));
        setTransitionCount(prev => prev + 1);
    };

    // Auto-play cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, imagesLength]);

    const slideVariants = {
        enter: {
            opacity: 0
        },
        center: {
            opacity: 1
        },
        exit: {
            opacity: 0
        }
    };

    return {
        currentIndex,
        direction,
        transitionCount,
        handlePrev,
        handleNext,
        slideVariants
    };
};
