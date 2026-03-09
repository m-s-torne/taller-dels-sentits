import { FadeInView } from '@/app/_components/FadeInView';

interface ParagraphListProps {
    paragraphs: string[];
    boldIndex?: number;
    image?: {
        src: string;
        alt: string;
    };
}

export const ParagraphList = ({ paragraphs, boldIndex, image }: ParagraphListProps) => {
    return (
        <FadeInView className="text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="flex flex-col md:block md:overflow-hidden">
                {image && (
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="w-100 object-cover rounded-[40px] mb-6 md:float-left md:mr-12 md:mb-4"
                    />
                )}
                <div className="space-y-4">
                    {paragraphs.map((paragraph, i) => (
                        <p key={i} className={i === boldIndex ? 'font-bold' : ''}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </FadeInView>
    );
};
