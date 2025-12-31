import { quiSomData } from './lib/quiSomData';

export default function QuiSom () {
    const sections = [
        { ...quiSomData.introduction, headingLevel: 'h2' as const },
        { ...quiSomData.history, headingLevel: 'h3' as const },
        { ...quiSomData.current, headingLevel: 'h3' as const }
    ];

    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto mt-5 sm:mt-15 px-4 py-22 sm:py-16 lg:py-30">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-shakespeare text-center mb-10 md:mb-15">
                    {quiSomData.mainTitle}
                </h1>
                
                <div className="max-w-4xl mx-auto space-y-8 text-gray-700 text-sm sm:text-lg leading-relaxed">
                    {sections.map((section, sectionIndex) => {
                        const HeadingTag = section.headingLevel;
                        const headingClasses = section.headingLevel === 'h2'
                            ? "text-2xl sm:text-3xl lg:text-4xl font-light text-shakespeare mb-6"
                            : "text-xl sm:text-2xl lg:text-3xl font-light text-shakespeare mb-6";
                        
                        return (
                            <section 
                                key={sectionIndex} 
                                className={`space-y-6 ${sectionIndex > 0 ? 'mt-12' : ''}`}
                            >
                                <HeadingTag className={headingClasses}>
                                    {section.title}
                                </HeadingTag>
                                {section.paragraphs.map((paragraph, paragraphIndex) => (
                                    <p key={paragraphIndex}>
                                        {paragraph}
                                    </p>
                                ))}
                            </section>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};
