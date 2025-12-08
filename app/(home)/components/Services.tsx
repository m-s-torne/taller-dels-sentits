"use client"
import Link from 'next/link';
import ButtonComponent from '@/app/_components/ButtonComponent';
import { servicesData } from '@/app/_lib/servicesData';
import { motion } from 'motion/react';

const Services = () => {

    return (
        <motion.section 
            className="bg-lilac py-20 px-4 sm:px-6 md:px-10 overflow-x-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {servicesData.map((service) => (
                    <div
                        key={service.title}
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
                        <Link href={`/${service.id === 'centres-educatius' ? 'centres' : service.id}`}>
                            <ButtonComponent text="SABER MÉS" />
                        </Link>
                    </div>
                ))}
            </div>
        </motion.section>
    );
};

export default Services;
