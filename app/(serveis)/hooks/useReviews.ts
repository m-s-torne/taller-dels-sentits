import { useState, useEffect } from 'react';

interface Review {
    review: string;
    author: string;
}

export const useReviews = (reviews: Review[]) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [transitionCount, setTransitionCount] = useState(0);
    
    // Filtrar reviews vacíos
    const validReviews = Array.isArray(reviews) 
        ? reviews.filter(r => typeof r === 'object' && r.review && r.review.trim())
        : [];

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? validReviews.length - 1 : prev - 1));
        setTransitionCount(prev => prev + 1);
    };

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === validReviews.length - 1 ? 0 : prev + 1));
        setTransitionCount(prev => prev + 1);
    };

    // Auto-play cada 8 segundos
    useEffect(() => {
        if (validReviews.length <= 1) return;

        const interval = setInterval(() => {
            handleNext();
        }, 8000);

        return () => clearInterval(interval);
    }, [currentIndex, validReviews.length]);

    const mobileReview = validReviews[currentIndex];

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
        validReviews,
        currentIndex,
        direction,
        transitionCount,
        mobileReview,
        handlePrev,
        handleNext,
        slideVariants,
    };
};
