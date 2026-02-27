"use client"
import { RoundHeaderImage } from '../_components/RoundHeaderImage';
import { quiSomData } from './lib/quiSomData';
import { SectionHeading } from '@/app/_components/SectionHeading';
import { HeroSection } from '@/app/(serveis)/components';
import headerImage from './assets/inici.jpg'
import { MemberCard } from './components/MemberCard';

export default function QuiSom () {
    const sections = [
        { ...quiSomData.history, headingLevel: 'h3' as const },
        { ...quiSomData.current, headingLevel: 'h3' as const }
    ];

    return (
        <main className="pt-10 pb-0 px-4 sm:px-6 md:px-10 mt-18 min-h-screen bg-lilac">
            <div className="max-w-5xl mx-auto">
                <HeroSection title={quiSomData.mainTitle} subtitle={quiSomData.subtitle} />
                
                <RoundHeaderImage src={headerImage.src} alt="header image"/>

                <div className="max-w-6xl mx-auto space-y-8 text-gray-700 text-sm sm:text-lg leading-relaxed">
                    {quiSomData.introduction.paragraphs.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>

                <div className="max-w-6xl mx-auto space-y-8 text-gray-700 text-sm sm:text-lg leading-relaxed mt-8">
                    {sections.map((section, sectionIndex) => (
                        <section 
                            key={sectionIndex} 
                            className={`space-y-6 ${sectionIndex > 0 ? 'mt-12' : ''}`}
                        >
                            <SectionHeading 
                                headingLevel={section.headingLevel}
                                title={section.title ?? 'no title provided'}
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
                        <SectionHeading headingLevel="h2" title={quiSomData.team.title} />
                        {quiSomData.team.members.map((member, i) => (
                            <MemberCard key={i} member={member} />
                        ))}
                    </section>

                    {/* Collaborators Section - COL.LABORADORS */}
                    <section className="space-y-6 mt-12">
                        <SectionHeading headingLevel="h2" title={quiSomData.collaborators.title} />
                        <p className="italic text-gray-700 text-sm sm:text-lg leading-relaxed">
                            {quiSomData.collaborators.intro}
                        </p>
                        <div className="-mx-[50vw] bg-shakespeare">
                            {quiSomData.collaborators.members.map((member, i) => (
                                <MemberCard key={i} member={member} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};
