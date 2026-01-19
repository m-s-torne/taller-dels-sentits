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
    exclamation?: string;
    longDescription: string[];
    quote?: Quote;
    questions: string[];
    moreContent: {
        buttonText: string;
        content: string[];
        listItems?: string[];
        layout?: 'with-images' | 'text-only' | 'text-only-not-heading';
    };
    disclaimer: string;
    reviews?: Review[];
    rest?: any;
    bgColor: string;
    contentKey: string;
    icon?: string;
}