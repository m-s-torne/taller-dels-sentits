import { FadeInView } from '@/app/_components/FadeInView';

interface DisclaimerSectionProps {
    disclaimer: string[];
}

export const DisclaimerSection = ({ disclaimer }: DisclaimerSectionProps) => {
    if (!disclaimer || disclaimer.length === 0) return null;

    const [firstSentence, ...restSentences] = disclaimer;

    return (
        <FadeInView as="section" className="mb-16 text-sm sm:text-lg leading-relaxed">
            {/* Primera frase fuera del container */}
            <p className="text-shakespeare! mb-4">
                {firstSentence.trim()}
            </p>
            
            {/* Resto de frases dentro del container */}
            {restSentences.length > 0 && (
                <div className="bg-shakespeare/10 border-l-4 border-shakespeare p-5 rounded-r-lg">
                    {restSentences.map((sentence, index) => (
                        <p key={index} className="text-gray-700 italic">
                            {sentence.trim()}
                        </p>
                    ))}
                </div>
            )}
        </FadeInView>
    );
};
