interface RoundHeaderImageProps {
    src: string;
    alt: string;
    className?: string;
}

export const RoundHeaderImage = ({ src, alt, className }: RoundHeaderImageProps) => {
    return (
        <div className="flex justify-center md:mb-5 mb-10">
            <img
                className={`w-50 h-50 sm:w-62 sm:h-62 md:w-85 md:h-85 object-cover rounded-full shadow-lg${className ? ` ${className}` : ''}`}
                src={src}
                alt={alt}
            />
        </div>
    );
};
