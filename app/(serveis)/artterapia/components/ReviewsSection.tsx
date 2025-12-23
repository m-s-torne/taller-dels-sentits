import { motion } from 'motion/react';

interface ReviewsSectionProps {
    reviews: {
        review: string;
        author: string;
    }[];
}

export const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
    // Filtrar reviews vacíos
    const validReviews = Array.isArray(reviews) 
        ? reviews.filter(r => typeof r === 'object' && r.review && r.review.trim())
        : [];

    if (validReviews.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
        >
            <div className="flex justify-center">
                <button className="text-lilac text-2xl sm:text-5xl rounded-[100px] shadow-thick-scampi border-lilac border-4 font-georgia py-15 px-10 bg-scampi tracking-wide text-center mb-10">
                    Algunes persones ens han dit:
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {validReviews.map((review, index) => (
                    <div 
                        key={index}
                        className="border-3 border-shakespeare p-6 rounded-[30px]"
                    >
                        <p className="text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-line">
                            {review.review.trim()}
                        </p>
                        <p className="text-shakespeare! text-xs sm:text-sm font-medium whitespace-pre-line">
                            - {review.author.trim()}
                        </p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
};
