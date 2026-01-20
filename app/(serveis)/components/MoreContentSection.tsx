"use client"
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { TriangleButton } from '@/app/_components/ui/TriangleButton';

interface MoreContentSectionProps {
    moreContent: {
        buttonText: string;
        content: string[];
        listItems?: string[];
        layout?: 'with-images' | 'text-only' | 'text-only-not-heading';
    };
    images?: { src: string; alt: string }[];
}

export const MoreContentSection = ({ moreContent, images }: MoreContentSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const layout = moreContent.layout || 'with-images';

    if (!moreContent.buttonText || !moreContent.content) return null;

    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center mb-6"
            >
                {/* Botón expandible */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`
                        bg-lilac text-shakespeare py-6 rounded-[40px] 
                        border-5 border-shakespeare font-light
                        text-sm sm:text-base lg:text-lg px-8
                        leading-relaxed hover:bg-shakespeare 
                        hover:text-lilac hover:shadow-thick-lilac-border-shakespeare 
                        transition-all duration-300 whitespace-pre-line text-center 
                        hover:cursor-pointer shadow-thick-shakespeare-border-lilac
                    `}
                >
                    {moreContent.buttonText.trim()}
                </button>
            </motion.div>

            {/* Contenido expandible - Full width */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ maxHeight: 0, opacity: 0, marginBottom: 0 }}
                        animate={{ maxHeight: 2000, opacity: 1, marginBottom: 64 }}
                        exit={{ maxHeight: 0, opacity: 0, marginBottom: 0 }}
                        transition={{ 
                            maxHeight: { duration: 0.7, ease: "easeInOut" },
                            opacity: { duration: 0.5, ease: "easeInOut" },
                            marginBottom: { duration: 0.7, ease: "easeInOut" }
                        }}
                        className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-shakespeare overflow-hidden py-10"
                    >
                            {layout === 'with-images' && images ? (
                                // Layout con imágenes (artterapia)
                                moreContent.content.map((text, index) => {
                                    const image = images[index];
                                    const isLastItem = index === moreContent.content.length - 1;
                                    return (
                                        <div key={index} className={`max-w-5xl mx-auto px-4 md:px-10 py-5 space-y-12`}>
                                            <div className={`flex flex-col ${index === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-12 items-center`}>
                                                <img 
                                                    src={image.src} 
                                                    alt={image.alt} 
                                                    className="w-64 h-80 md:w-80 md:h-112 object-cover rounded-[40px] shrink-0" 
                                                />
                                                <div className="space-y-4">
                                                    <p className="text-lilac! font-light text-sm sm:text-base lg:text-lg leading-relaxed">
                                                        {text.trim()}
                                                    </p>
                                                    {isLastItem && moreContent.listItems && (
                                                        <ul className="text-lilac! font-light text-sm sm:text-base lg:text-lg leading-relaxed space-y-3 list-disc pl-6">
                                                            {moreContent.listItems.map((item, idx) => (
                                                                <li key={idx}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                // Layout solo texto (centres-educatius)
                                <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-5 space-y-12">
                                    {moreContent.content.map((text, index) => (
                                            <p key={index} className="text-lilac! font-light text-sm sm:text-base lg:text-lg my-10 px-10">
                                                {text.trim()}
                                            </p>
                                    ))}
                                </div>
                            )}

                            {/* Botón para colapsar */}
                            <div className="flex justify-center py-8">
                                <TriangleButton 
                                    triangleRotation="rotate(180deg)"
                                    onClick={() => setIsExpanded(false)}
                                />
                            </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
