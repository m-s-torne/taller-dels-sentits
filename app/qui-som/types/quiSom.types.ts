export interface QuiSomNarrativeSection {
    title?: string;
    paragraphs: string[];
}

export interface TeamMember {
    name: string;
    bio: string[];
    image: string;
}

export interface QuiSomData {
    mainTitle: string;
    subtitle: string;
    introduction: QuiSomNarrativeSection;
    history: QuiSomNarrativeSection;
    current: QuiSomNarrativeSection;
    team: {
        title: string;
        members: TeamMember[];
    };
    collaborators: {
        title: string;
        intro: string;
        members: TeamMember[];
    };
}
