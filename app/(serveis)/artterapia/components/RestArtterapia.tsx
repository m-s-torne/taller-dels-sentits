import { motion } from 'motion/react';

interface RestSectionProps {
    rest: {
        title: string;
        subtitle: string;
        list: string[];
        description: string;
        sessionTypes: Array<{
            desc: string;
            icon: string;
        }>;
    };
}

export const RestArtterapia = ({ rest }: RestSectionProps) => {
    if (!rest || !rest.title) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16 pt-10"
        >
            <div className="text-center mb-12 space-y-7">
                <h2 className="text-shakespeare! text-2xl sm:text-5xl font-light tracking-wide">
                    {rest.title}
                </h2>
                <p className="text-shakespeare! text-sm sm:text-base lg:text-lg leading-relaxed">
                    {rest.subtitle}
                </p>
                <div className="shadow-thick-shakespeare rounded-[40px] border-4 border-shakespeare px-8 py-10 max-w-4xl mx-auto">
                    <ul className="list-none space-y-3 text-left text-[11px] sm:text-base lg:text-lg leading-relaxed">
                        {rest.list.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="shrink-0">-</span>
                                <span>{item.trim()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <p className="text-shakespeare! text-sm sm:text-base lg:text-lg leading-relaxed mb-8 mx-8 md:mx-17">
                {rest.description}
            </p>

            {/* Session Types */}
            {rest.sessionTypes && rest.sessionTypes.length > 0 && (
                <div className="space-y-20 my-20">
                    {rest.sessionTypes.map((session, index) => (
                        <div key={index} className="flex items-start gap-6">
                            <div className="relative w-32.5 h-32.5 flex items-center justify-center shrink-0">
                                <div className="absolute inset-0 flex items-center justify-center scale-[2.5]">
                                    <img 
                                        src={session.icon} 
                                        alt={`Session type ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                            <h1 className="text-shakespeare! font-light text-lg sm:text-xl md:text-4xl leading-relaxed flex-1 pt-2">
                                {session.desc}
                            </h1>
                        </div>
                    ))}
                </div>
            )}
        </motion.section>
    );
};
