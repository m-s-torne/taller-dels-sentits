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
        <div className="relative w-full flex items-center justify-center py-12">
            {/* Botón anterior */}
            <button
                onClick={handlePrev}
                className="absolute hover:cursor-pointer left-4 md:left-12 z-10 text-shakespeare hover:text-shakespeare/70 transition-colors cursor-pointer bg-black/60 md:bg-transparent rounded-lg md:rounded-none py-4 px-3 md:p-0"
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

            {/* Contenedor de imagen */}
            <div className="relative w-full max-w-3xl h-96 md:h-[500px] overflow-hidden rounded-[40px]">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={`${currentIndex}-${transitionCount}`}
                        src={images[currentIndex].src}
                        alt={images[currentIndex].alt}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 50 },
                            opacity: { duration: 0.3 }
                        }}
                        className="absolute w-full h-full object-cover"
                    />
                </AnimatePresence>
            </div>

            {/* Botón siguiente */}
            <button
                onClick={handleNext}
                className="absolute hover:cursor-pointer right-4 md:right-12 z-10 text-shakespeare hover:text-shakespeare/70 transition-colors cursor-pointer bg-black/60 md:bg-transparent rounded-lg md:rounded-none py-4 px-3 md:p-0"
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
    );
};
