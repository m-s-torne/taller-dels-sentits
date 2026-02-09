type Service = "artterapia" | "artperdins" | "centres-educatius";

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
    bgColor: string;
    contentKey: string;
    icon?: string;
}