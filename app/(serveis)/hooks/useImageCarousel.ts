import { useState, useEffect, useCallback } from 'react';

export const useImageCarousel = (imagesLength: number) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? imagesLength - 1 : prev - 1));
    }, [imagesLength]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === imagesLength - 1 ? 0 : prev + 1));
    }, [imagesLength]);

    // Auto-play cada 5 segundos
    useEffect(() => {
        const interval = setInterval(handleNext, 5000);
        return () => clearInterval(interval);
    }, [handleNext]);

    return {
        currentIndex,
        handlePrev,
        handleNext,
    };
};
