import { SectionHeading } from '@/app/_components/SectionHeading';
import { FadeInView } from '@/app/_components/FadeInView';

interface Props {
    title: string;
    list?: string[];
    className?: string;
}

export function SubheadingWithList({ title, list, className }: Props) {
    return (
        <FadeInView className={`mt-4 ${className ?? ''}`}>
            <SectionHeading headingLevel="h3" title={title} className="text-xl! sm:text-xl! lg:text-2xl!" />
            {list && (
                <div className="shadow-thick-shakespeare rounded-[40px] border-4 border-shakespeare px-8 py-10 mt-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[11px] sm:text-base lg:text-lg leading-relaxed list-none">
                        {list.map((item, j) => (
                            <li key={j} className="flex items-start gap-4">
                                <span className="shrink-0">–</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </FadeInView>
    );
}
