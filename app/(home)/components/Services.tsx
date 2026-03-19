"use client"
import Link from 'next/link';
import ButtonComponent from '@/app/_components/ui/ButtonComponent';
import { servicesData } from '@/app/_lib/servicesData';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Services = () => {

    return (
        <motion.section 
            className="bg-lilac py-20 px-4 sm:px-6 md:px-10 overflow-x-hidden"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {servicesData.map((service) => (
                    <motion.div
                        key={service.title}
                        variants={cardVariants}
                        className="flex flex-col items-center text-center"
                    >
                        {/* Icono */}
                        {service.icon && (
                            <div className="mb-0">
                                <img 
                                    src={service.icon} 
                                    alt={service.title}
                                    className="w-46 h-36 md:w-50 md:h-35 object-contain"
                                />
                            </div>
                        )}
                        
                        {/* Título */}
                        <h2 className="text-shakespeare! text-lg sm:text-2xl font-light tracking-[0.2em] h-10 mb-6 sm:mb-8">
                            {service.title}
                        </h2>
                        
                        {/* Contenido */}
                        <p className="text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 max-w-sm px-4 sm:px-0 h-20 whitespace-pre-line">
                            {service.shortDescription}
                        </p>
                        
                        {/* Botón */}
                        <Link href={`/${service.id}`}>
                            <ButtonComponent text="SABER MÉS" />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};

export default Services;
