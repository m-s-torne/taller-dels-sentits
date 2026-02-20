"use client"
import { motion, AnimatePresence } from 'motion/react';
import { useImageCarousel } from '@/app/(serveis)/hooks/useImageCarousel';

interface ImageCarouselProps {
    images: { src: string; alt: string }[];
}

export const ImageCarousel = ({ images }: ImageCarouselProps) => {
    const { 
        currentIndex, 
        direction, 
        transitionCount, 
        handlePrev, 
        handleNext, 
        slideVariants 
    } = useImageCarousel(images.length);

    return (
        <div className="mb-16">
            {/* Contenedor de imagen */}
            <div className="relative w-full max-w-3xl mx-auto h-96 md:h-125 overflow-hidden rounded-[40px]">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={`${currentIndex}-${transitionCount}`}
                        src={images[currentIndex].src}
                        alt={images[currentIndex].alt}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            duration: 1,
                            ease: "easeInOut"
                        }}
                        className="absolute w-full h-full object-cover"
                    />
                </AnimatePresence>
            </div>

            {/* Botones de navegación */}
            {images.length > 1 && (
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={handlePrev}
                        className="hover:cursor-pointer text-shakespeare hover:text-shakespeare/70 transition-colors focus:outline-none active:outline-none [-webkit-tap-highlight-color:transparent]"
                        aria-label="Imagen anterior"
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
                        aria-label="Imagen siguiente"
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
        </div>
    );
};
