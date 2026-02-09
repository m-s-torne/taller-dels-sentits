import { useState } from 'react';

interface Review {
    review: string;
    author: string;
}

export const useReviews = (reviews: Review[]) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Filtrar reviews vacíos
    const validReviews = Array.isArray(reviews) 
        ? reviews.filter(r => typeof r === 'object' && r.review && r.review.trim())
        : [];

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? validReviews.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === validReviews.length - 1 ? 0 : prev + 1));
    };

    const mobileReview = validReviews[currentIndex];

    return {
        validReviews,
        currentIndex,
        mobileReview,
        handlePrev,
        handleNext,
    };
};
