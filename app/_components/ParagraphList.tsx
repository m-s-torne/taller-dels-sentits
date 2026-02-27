interface ParagraphListProps {
    paragraphs: string[];
    boldIndex?: number;
}

export const ParagraphList = ({ paragraphs, boldIndex }: ParagraphListProps) => {
    return (
        <div className="text-sm sm:text-base lg:text-lg leading-relaxed space-y-4">
            {paragraphs.map((paragraph, i) => (
                <p key={i} className={i === boldIndex ? 'font-bold' : ''}>
                    {paragraph}
                </p>
            ))}
        </div>
    );
};
