"use client"
import { motion } from 'motion/react';
import { servicesData } from '@/app/_lib/servicesData';
import { CentresEducatiusContent } from '@/app/serveis/components/ServiceSection/ServiceContents';

export default function Centres() {
    const service = servicesData.find(s => s.id === 'centres-educatius')!;

    return (
        <main>
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`${service.bgColor} py-20 px-4 sm:px-6 md:px-10 mt-20 overflow-x-hidden min-h-screen`}
            >
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-[#7B8BC7] text-lg sm:text-3xl lg:text-4xl font-light tracking-[0.2em] mb-3 text-center">
                        {service.title}
                    </h1>
                    
                    <p className="text-gray-700 text-base sm:text-xl text-center mb-4 font-light italic">
                        {service.subtitle}
                    </p>

                    <CentresEducatiusContent />
                </div>
            </motion.section>
        </main>
    );
}
