type Service = "artterapia" | "artperdins" | "serveis-externs";

export interface Quote {
    text: string;
    author: string;
}

export type Question = {
    service: Service;
    text: string;
}

type Review = {
    review: string,
    author: string,
}

export interface ServicePageSubsection {
    title: string;
    subtitle?: string;
    paragraphs: string[];
    subheading?: string;
    list?: string[];
}

export interface ServicePageSection {
    title: string;
    paragraphs: string[];
    subheading?: string;
    list?: string[];
    subsections?: ServicePageSubsection[];
}

export interface ServiceSectionType {
    id: Service;
    title: string;
    subtitle: string;
    shortDescription: string;
    exclamation?: string;
    longDescription: string[];
    quote?: Quote;
    questions: Question[];
    moreContent: {
        buttonText: string;
        content: string[];
        listItems?: string[];
    };
    disclaimer: string[];
    reviews?: Review[];
    rest?: any;
    sections?: ServicePageSection[];
    bgColor: string;
    contentKey: string;
    icon?: string;
}