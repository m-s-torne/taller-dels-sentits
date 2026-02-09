import { quiSomData } from './lib/quiSomData';
import { SectionHeading } from './components/SectionHeading';

export default function QuiSom () {
    const sections = [
        { ...quiSomData.introduction, headingLevel: 'h2' as const },
        { ...quiSomData.history, headingLevel: 'h3' as const },
        { ...quiSomData.current, headingLevel: 'h3' as const }
    ];

    return (
        <main className="py-10 px-4 sm:px-6 md:px-10 mt-18 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-center text-shakespeare! text-3xl sm:text-4xl lg:text-6xl font-light tracking-[0.2em] mb-6">
                    {quiSomData.mainTitle}
                </h1>
                
                <div className="max-w-6xl mx-auto space-y-8 text-gray-700 text-sm sm:text-lg leading-relaxed">
                    {sections.map((section, sectionIndex) => (
                        <section 
                            key={sectionIndex} 
                            className={`space-y-6 ${sectionIndex > 0 ? 'mt-12' : ''}`}
                        >
                            <SectionHeading 
                                headingLevel={section.headingLevel}
                                title={section.title}
                            />
                            {section.paragraphs.map((paragraph, paragraphIndex) => {
                                const isHighlightedParagraph = paragraph.includes("El Taller dels Sentits és un espai respectuós");
                                return (
                                    <p key={paragraphIndex} className={isHighlightedParagraph ? 'font-bold' : ''}>
                                        {paragraph}
                                    </p>
                                );
                            })}
                        </section>
                    ))}

                    {/* Team Section - CONEIX-NOS */}
                    <section className="space-y-6 mt-12">
                        <SectionHeading 
                            headingLevel="h2"
                            title={quiSomData.team.title}
                        />
                        {quiSomData.team.members.map((member, memberIndex) => (
                            <div key={memberIndex} className="mt-8">
                                <h3 className="text-xl sm:text-2xl font-normal text-shakespeare mb-4">
                                    {member.name}
                                </h3>
                                <div className="w-full md:w-80 shrink-0 mb-6">
                                    {member.image !== "" && (
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="w-full rounded-lg shadow-md"
                                        />
                                    )}
                                    {member.image === "" && (
                                        <img 
                                            alt={member.name}
                                            className="w-full rounded-lg shadow-md bg-gray-100"
                                        />
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {member.bio.map((paragraph, paragraphIndex) => (
                                        <p key={paragraphIndex}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Collaborators Section - COL.LABORADORS */}
                    <section className="space-y-6 mt-12">
                        <SectionHeading 
                            headingLevel="h2"
                            title={quiSomData.collaborators.title}
                        />
                        <p className="italic">
                            {quiSomData.collaborators.intro}
                        </p>
                        {quiSomData.collaborators.members.map((member, memberIndex) => (
                            <div key={memberIndex} className="mt-8">
                                <h3 className="text-xl sm:text-2xl font-normal text-shakespeare mb-4">
                                    {member.name}
                                </h3>
                                <div className="w-full md:w-80 shrink-0 mb-6">
                                    {member.image !== "" && (
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="w-full rounded-lg shadow-md"
                                        />
                                    )}
                                    {member.image === "" && (
                                        <img 
                                            alt={member.name}
                                            className="w-full rounded-lg shadow-md bg-gray-100"
                                        />
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {member.bio.map((paragraph, paragraphIndex) => (
                                        <p key={paragraphIndex}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </main>
    );
};
