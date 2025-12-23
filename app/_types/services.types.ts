export interface Quote {
    text: string;
    author: string;
}

type Review = {
    review: string,
    author: string,
}
export interface ServiceSectionType {
    id: string;
    title: string;
    subtitle: string;
    shortDescription: string;
    longDescription: string[];
    quotes: Quote[];
    questions: string[];
    moreContent: {
        buttonText: string,
        content: string[],
        layout?: 'with-images' | 'text-only',
    };
    disclaimer: string;
    reviews?: Review[];
    rest?: any;
    bgColor: string;
    contentKey: string;
    icon?: string;
}