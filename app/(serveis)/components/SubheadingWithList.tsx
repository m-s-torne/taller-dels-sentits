import { SectionHeading } from '@/app/_components/SectionHeading';
import { FadeInView } from '@/app/_components/FadeInView';
import type { SchoolProjectItem } from '@/app/_types/services.types';

interface Props {
    title: string;
    list?: string[];
    objectList?: SchoolProjectItem[];
    className?: string;
}

export function SubheadingWithList({ title, list, objectList, className }: Props) {
    return (
        <FadeInView className={`mt-4 ${className ?? ''}`}>
            <SectionHeading headingLevel="h3" title={title} className="text-xl! sm:text-xl! lg:text-2xl!" />
            {(list || objectList) && (
                <div className="shadow-thick-shakespeare rounded-[40px] border-4 border-shakespeare px-8 py-10 mt-6">
                    <ul className="columns-1 sm:columns-2 gap-x-8 text-[11px] sm:text-base lg:text-lg leading-relaxed list-none">
                        {list?.map((item, j) => (
                            <li key={j} className="flex items-start gap-4 mb-3 break-inside-avoid">
                                <span className="shrink-0">–</span>
                                <span>{item}</span>
                            </li>
                        ))}
                        {objectList?.map((item, j) => (
                            <li key={j} className="flex items-start gap-4 mb-3 break-inside-avoid">
                                <span className="shrink-0">–</span>
                                <span>
                                    {item.school}
                                    {item.project && (
                                        <>: <strong>{item.project}</strong></>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </FadeInView>
    );
}
