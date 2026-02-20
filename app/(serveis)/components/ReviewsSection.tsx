"use client"
import { motion, AnimatePresence } from 'motion/react';
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
        direction,
        transitionCount,
        mobileReview,
        handlePrev,
        handleNext,
        slideVariants,
    } = useReviews(reviews);

    if (validReviews.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16 pt-20"
        >
            {/* Título */}
            <h2 className="text-shakespeare! text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-5">
                Algunes persones ens han dit:
            </h2>
            
            {/* Carrusel Desktop (1 review) */}
            <div className="hidden md:block relative">
                <div className="max-w-3xl mx-auto min-h-90 flex justify-center items-center">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div 
                            key={`${currentIndex}-${transitionCount}`}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                duration: 1,
                                ease: "easeInOut"
                            }}
                            className="max-w-xl mx-auto border-3 border-shakespeare p-6 rounded-[30px] flex flex-col absolute top-1/2 -translate-y-1/2 left-0 right-0"
                        >
                            <p className="text-sm sm:text-base leading-relaxed mb-4">
                                {mobileReview.review.trim()}
                            </p>
                            <p className="text-shakespeare! text-xs sm:text-sm font-medium whitespace-pre-line mt-auto">
                                - {mobileReview.author.trim()}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Carrusel Mobile (1 review) */}
            <div className="md:hidden relative min-h-90">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={`${currentIndex}-${transitionCount}`}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            duration: 1,
                            ease: "easeInOut"
                        }}
                        className="max-w-xl mx-auto border-3 border-shakespeare p-6 rounded-[30px] flex flex-col absolute top-1/2 -translate-y-1/2 left-0 right-0"
                    >
                        <p className="text-sm sm:text-base leading-relaxed mb-4">
                            {mobileReview.review.trim()}
                        </p>
                        <p className="text-shakespeare! text-xs sm:text-sm font-medium whitespace-pre-line mt-auto">
                            - {mobileReview.author.trim()}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Botones de navegación */}
            {validReviews.length > 1 && (
                <div className="flex justify-center gap-4 mt-5">
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
