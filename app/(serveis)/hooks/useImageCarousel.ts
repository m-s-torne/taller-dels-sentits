import { useState } from 'react';

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

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -1000 : 1000,
            opacity: 0
        })
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
