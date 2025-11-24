export interface Quote {
    text: string;
    author: string;
}

export interface ServiceSectionType {
    id: string;
    title: string;
    subtitle: string;
    shortDescription: string;
    quotes: Quote[];
    bgColor: string;
    contentKey: string;
    delay: number;
    icon?: string;
}