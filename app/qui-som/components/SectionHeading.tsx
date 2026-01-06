interface SectionHeadingProps {
    headingLevel: 'h2' | 'h3';
    title: string;
}

export const SectionHeading = ({ headingLevel, title }: SectionHeadingProps) => {
    const HeadingTag = headingLevel;
    const headingClasses = headingLevel === 'h2'
        ? "text-2xl sm:text-3xl lg:text-4xl font-light text-shakespeare mb-6"
        : "text-xl sm:text-2xl lg:text-3xl font-light text-shakespeare mb-6";

    return (
        <HeadingTag className={headingClasses}>
            {title}
        </HeadingTag>
    );
};
