import { motion } from 'motion/react'

interface RestSectionProps {
    rest: {
        title: string;
        icon: string;
        content: string[];
    };
}

export const RestCentres = ({ rest }: RestSectionProps) => {
    if (!rest || !rest.title) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="pt-10"
        >
            <div className="mb-12 space-y-12">
                <h2 className="text-shakespeare! text-2xl sm:text-4xl font-light tracking-wide text-center">
                    {rest.title}
                </h2>
                <div className="w-50 h-50 mx-auto flex items-center justify-center">
                    <div className="scale-[2.5]">
                        <img 
                            src={rest.icon} 
                            alt="icona-centres"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
                <div className="text-sm sm:text-base lg:text-lg leading-relaxed space-y-4">
                    {rest.content.map((text, i) => 
                        <p key={i}>{text}</p>
                    )}
                </div>
            </div>
        </motion.section>
    )
}