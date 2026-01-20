"use client"
import { motion } from 'motion/react';
import { useReviews } from '@/app/(serveis)/hooks/useReviews';

interface ReviewsSectionProps {
    reviews: {
        review: string;
        author: string;
    }[];
}

export const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
    const {
        validReviews,
        currentIndex,
        desktopReviews,
        mobileReview,
        handlePrev,
        handleNext,
    } = useReviews(reviews);

    if (validReviews.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16 pt-10"
        >
            {/* Título */}
            <h2 className="text-shakespeare! text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-10">
                Algunes persones ens han dit:
            </h2>
            
            {/* Carrusel Desktop (3 reviews) */}
            <div className="hidden md:block relative">
                <div className="grid grid-cols-3 gap-8">
                    {desktopReviews.map((review, index) => (
                        <motion.div 
                            key={`${currentIndex}-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="border-3 border-shakespeare p-6 rounded-[30px] flex flex-col"
                        >
                            <p className="text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-line">
                                {review.review.trim()}
                            </p>
                            <p className="text-shakespeare! text-xs sm:text-sm font-medium whitespace-pre-line mt-auto">
                                - {review.author.trim()}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Carrusel Mobile (1 review) */}
            <div className="md:hidden">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-60 border-3 border-shakespeare p-6 rounded-[30px] flex flex-col"
                >
                    <p className="text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-line">
                        {mobileReview.review.trim()}
                    </p>
                    <p className="text-shakespeare! text-xs sm:text-sm font-medium whitespace-pre-line mt-auto">
                        - {mobileReview.author.trim()}
                    </p>
                </motion.div>
            </div>

            {/* Botones de navegación */}
            {validReviews.length > 1 && (
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={handlePrev}
                        className="hover:cursor-pointer text-shakespeare hover:text-shakespeare/70 transition-colors focus:outline-none active:outline-none [-webkit-tap-highlight-color:transparent]"
                        aria-label="Review anterior"
                    >
                        <div 
                            className="transform transition-all duration-300 ease-out hover:scale-110"
                            style={{ transform: 'rotate(-270deg)' }}
                        >
                            <svg width="40" height="16" viewBox="0 0 40 16" fill="currentColor" className="mx-auto">
                                <path d="M20 14L38 2L2 2Z" />
                            </svg>
                        </div>
                    </button>

                    <button
                        onClick={handleNext}
                        className="hover:cursor-pointer text-shakespeare hover:text-shakespeare/70 transition-colors focus:outline-none active:outline-none [-webkit-tap-highlight-color:transparent]"
                        aria-label="Review siguiente"
                    >
                        <div 
                            className="transform transition-all duration-300 ease-out hover:scale-110"
                            style={{ transform: 'rotate(270deg)' }}
                        >
                            <svg width="40" height="16" viewBox="0 0 40 16" fill="currentColor" className="mx-auto">
                                <path d="M20 14L38 2L2 2Z" />
                            </svg>
                        </div>
                    </button>
                </div>
            )}
        </motion.section>
    );
};
