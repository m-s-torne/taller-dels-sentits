export interface ContentStep {
    key: string;
    label: string;
    icon: string;
}

export interface ContentData {
    title: string;
    quote: string;
    author: string;
    text: string;
}

export interface ContentSectionData {
    [key: string]: ContentData;
}
