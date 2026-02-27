"use client"
import { RoundHeaderImage } from '../_components/RoundHeaderImage';
import { quiSomData } from './lib/quiSomData';
import { SectionHeading } from '@/app/_components/SectionHeading';
import { ParagraphList } from '@/app/_components/ParagraphList';
import { HeroSection } from '@/app/(serveis)/components';
import headerImage from './assets/inici.jpg'
import { MemberCard } from './components/MemberCard';

export default function QuiSom () {
    const sections = [
        { ...quiSomData.history, headingLevel: 'h3' as const, boldIndex: undefined },
        { ...quiSomData.current, headingLevel: 'h3' as const, boldIndex: 1 },
    ];

    return (
        <main className="pt-10 pb-0 px-4 sm:px-6 md:px-10 mt-18 min-h-screen bg-lilac">
            <div className="max-w-5xl mx-auto">
                <HeroSection title={quiSomData.mainTitle} subtitle={quiSomData.subtitle} />
                
                <RoundHeaderImage src={headerImage.src} alt="header image"/>

                <div className="max-w-6xl mx-auto space-y-8 text-gray-700 text-sm sm:text-lg leading-relaxed">
                    <ParagraphList paragraphs={quiSomData.introduction.paragraphs} />
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
                            <ParagraphList paragraphs={section.paragraphs} boldIndex={section.boldIndex} />
                        </section>
                    ))}

                    {/* Team Section - CONEIX-NOS */}
                    <section className="space-y-6 mt-12">
                        <SectionHeading headingLevel="h2" title={quiSomData.team.title} className="text-center"/>
                        {quiSomData.team.members.map((member, i) => (
                            <MemberCard key={i} member={member} />
                        ))}
                    </section>

                    {/* Collaborators Section - COL.LABORADORS */}
                    <section className="space-y-6 mt-12">
                        <SectionHeading headingLevel="h2" title={quiSomData.collaborators.title} className="text-center"/>
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
