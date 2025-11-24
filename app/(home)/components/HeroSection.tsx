"use client"
import heroImg from '@/app/(home)/assets/images/miriam_porta.jpg'
import { motion } from 'motion/react';

const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {/* Banner azul */}
      <div className="bg-shakespeare py-4 pt-25 overflow-x-hidden">
        <div className="text-center ">
          <p className="text-white sm:text-xl font-light tracking-wide">
            centre d'artteràpia i expressió plàstica
          </p>
        </div>
      </div>

      {/* Hero principal */}
      <section className="bg-[#F8F6F3] py-20 px-4 sm:px-6 md:px-10 overflow-x-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Imagen circular a la izquierda */}
          <div className="shrink-0">
            <img
              className="w-60 h-60 left- sm:w-72 sm:h-72 md:w-80 md:h-80 object-cover rounded-full shadow-lg"
              src={heroImg.src}
              alt="Taller dels Sentits - Artteràpia" 
            />
          </div>

          {/* Contenido de texto a la derecha */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-shakespeare leading-relaxed text-[15px] sm:text-[16px] font-normal mb-2 tracking-wide">
              Un viatge cap endins... <br />
              ... un viatge cap enfora <br />
            </p>
            <p className="my-4 text-shakespeare sm:text-[16px] text-[15px] font-normal ">
              És en aquest vaivé que l'art ens posa en moviment i pot ser transformador
            </p>
            <h1 className="text-2xl font-medium sm:text-4xl md:text-5xl text-gray-800 mb-4 leading-tight">
              SENTIR EXPRESSAR  CREAR
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
              T'oferim un espai de permís i escolta; un acompanyament acurat a través de l'art com a cura del viure
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  )
};

export default HeroSection;