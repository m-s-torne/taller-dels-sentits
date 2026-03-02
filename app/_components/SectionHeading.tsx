interface SectionHeadingProps {
    headingLevel: 'h1' | 'h2' | 'h3';
    title: string;
    subtitle?: string;
    className?: string;
}

export const SectionHeading = ({ headingLevel, title, subtitle, className }: SectionHeadingProps) => {
    const HeadingTag = headingLevel;
    const baseClasses =
        headingLevel === 'h1'
            ? "text-center text-3xl sm:text-4xl lg:text-6xl font-light text-shakespeare! tracking-[0.2em] mb-6"
            : headingLevel === 'h2'
            ? "text-2xl sm:text-4xl lg:text-5xl font-light text-shakespeare! tracking-wide mb-6"
            : "text-xl sm:text-2xl lg:text-3xl font-light text-shakespeare! mb-6";

    return (
        <>
            <HeadingTag className={`${baseClasses}${className ? ` ${className}` : ''}`}>
                {title}
            </HeadingTag>
            {subtitle && (
                <p className="text-base sm:text-[15px] lg:text-[20px] font-light">
                    {subtitle}
                </p>
            )}
        </>
    );
};
