"use client"
import heroImg from '@/app/(home)/assets/images/miriam_porta.jpg'
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const HeroSection = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Banner azul */}
      <motion.div variants={itemVariants} className="bg-shakespeare py-4 pt-25 overflow-x-hidden">
        <div className="text-center ">
          <h3 className="text-lilac! sm:text-xl font-light tracking-wide">
            ~ Centre d'artteràpia i expressió plàstica ~
          </h3>
        </div>
      </motion.div>

      {/* Hero principal */}
      <motion.section variants={itemVariants} className="bg-lilac py-20 px-4 sm:px-6 md:px-10 overflow-x-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Imagen circular a la izquierda */}
          <div className="shrink-0">
            <img
              className="object-[-3%_center] w-50 h-50 sm:w-62 sm:h-62 md:w-85 md:h-85 object-cover rounded-full shadow-lg"
              src={heroImg.src}
              alt="Taller dels Sentits - Artteràpia" 
            />
          </div>

          {/* Contenido de texto a la derecha */}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-medium sm:text-4xl md:text-5xl text-gray-800 mb-4 leading-tight">
              SENTIR, EXPRESSAR, CREAR
            </h1>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto">
              T'oferim un espai de permís i escolta; un acompanyament acurat a través de l'art com a cura del viure
            </p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
};

export default HeroSection;