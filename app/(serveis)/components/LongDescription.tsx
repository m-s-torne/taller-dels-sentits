import { FadeInView } from '@/app/_components/FadeInView';
import CorazonIcon from '@/app/_assets/iconos/ESPACIO/CORAZON.svg';

interface LongDescriptionProps {
    longDescription: string[];
}

export const LongDescription = ({ longDescription }: LongDescriptionProps) => {

    return (
        <FadeInView as="section" className="mb-16">
            <div className="text-sm sm:text-base lg:text-lg leading-relaxed space-y-4">
                {longDescription.map((paragraph, index) => (
                    <p key={index}>
                        {paragraph.trim()}
                    </p>
                ))}
            </div>
        </FadeInView>
    );
};
