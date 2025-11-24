import { motion } from "motion/react"

export const ServeisHero = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="bg-[#F5EFE7] py-32 px-4 sm:px-6 md:px-10 overflow-x-hidden"
        >
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-gray-800 text-2xl sm:text-4xl lg:text-5xl font-light tracking-wide leading-relaxed mb-6">
                    ELS NOSTRES SERVEIS
                </h1>
                <p className="text-gray-700 text-sm sm:text-lg lg:text-xl font-light leading-relaxed">
                    Descobreix com podem acompanyar-te en el teu procés creatiu
                </p>
            </div>
        </motion.section>
    )
}