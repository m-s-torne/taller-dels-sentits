import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { TriangleButton } from '@/app/_components/ui/TriangleButton';

interface ReviewsSectionProps {
    reviews: {
        review: string;
        author: string;
    }[];
}

export const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Filtrar reviews vacíos
    const validReviews = Array.isArray(reviews) 
        ? reviews.filter(r => typeof r === 'object' && r.review && r.review.trim())
        : [];

    if (validReviews.length === 0) return null;

    const hasMoreThanThree = validReviews.length > 3;
    const firstThree = validReviews.slice(0, 3);
    const remaining = validReviews.slice(3);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
        >
            <div className="flex justify-center">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-lilac text-2xl sm:text-5xl rounded-[100px] shadow-thick-scampi border-lilac border-4 font-georgia py-15 px-10 bg-scampi tracking-wide text-center mb-10 hover:bg-scampi/80 transition-colors cursor-pointer"
                >
                    Algunes persones ens han dit:
                </button>
            </div>
            
            {/* Primeras 3 reviews - siempre visibles */}
            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {firstThree.map((review, index) => (
                        <div 
                            key={index}
                            className="border-3 border-shakespeare p-6 rounded-[30px] flex flex-col"
                        >
                            <p className="text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-line">
                                {review.review.trim()}
                            </p>
                            <p className="text-shakespeare! text-xs sm:text-sm font-medium whitespace-pre-line mt-auto">
                                - {review.author.trim()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Blur cuando hay más de 3 y no está expandido */}
                <AnimatePresence>
                    {hasMoreThanThree && !isExpanded && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="absolute inset-0 top-1/4 md:top-1/3 bg-linear-to-b from-transparent via-lilac/50 to-lilac h-full pointer-events-none"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Reviews adicionales - expandibles */}
            <AnimatePresence>
                {isExpanded && hasMoreThanThree && (
                    <motion.div
                        initial={{ opacity: 0, maxHeight: 0 }}
                        animate={{ opacity: 1, maxHeight: 2000 }}
                        exit={{ opacity: 0, maxHeight: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            {remaining.map((review, index) => (
                                <div 
                                    key={index + 3}
                                    className="border-3 border-shakespeare p-6 rounded-[30px] flex flex-col"
                                >
                                    <p className="text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-line">
                                        {review.review.trim()}
                                    </p>
                                    <p className="text-shakespeare! text-xs sm:text-sm font-medium whitespace-pre-line mt-auto">
                                        - {review.author.trim()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TriangleButton */}
            {hasMoreThanThree && (
                <div className="flex justify-center mt-8">
                    <TriangleButton 
                        triangleRotation={isExpanded ? "rotate(0deg)" : "rotate(180deg)"}
                        onClick={() => setIsExpanded(!isExpanded)}
                        color="scampi"
                    />
                </div>
            )}
        </motion.section>
    );
};
