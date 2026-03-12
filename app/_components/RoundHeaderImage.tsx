import Image, { StaticImageData } from 'next/image';

interface RoundHeaderImageProps {
    src: StaticImageData;
    alt: string;
    className?: string;
}

export const RoundHeaderImage = ({ src, alt, className }: RoundHeaderImageProps) => {
    return (
        <div className="flex justify-center md:mb-5 mb-10">
            <Image
                className={`w-50 h-50 sm:w-62 sm:h-62 md:w-85 md:h-85 object-cover rounded-full shadow-lg${className ? ` ${className}` : ''}`}
                src={src}
                alt={alt}
                width={340}
                height={340}
                sizes="(min-width: 768px) 340px, (min-width: 640px) 248px, 200px"
                placeholder="blur"
                priority
            />
        </div>
    );
};
