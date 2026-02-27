import { motion } from 'motion/react';
import { SectionHeading } from '@/app/_components/SectionHeading';

interface RestArtperDinsProps {
    rest: {
        title: string,
        content: string[],
        images: string[],
    }
}

export const RestArtperDins = ({ rest }: RestArtperDinsProps) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="py-10"
        >
            <div className="text-center space-y-7">
                <SectionHeading headingLevel="h2" title={rest.title} className="sm:text-5xl! lg:text-5xl!" />

                {rest.content.map((p, i) => {
                    return <p key={i} className="text-left text-sm sm:text-base lg:text-lg ml-6 sm:ml-0">{p}</p>
                })}
            </div>
        </motion.section>
    )
}