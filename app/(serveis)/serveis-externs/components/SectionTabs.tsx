"use client"

interface Tab {
    key: string;
    label: string;
    icon: string;
}

interface SectionTabsProps {
    tabs: Tab[];
    selectedTab: string;
    onTabChange: (key: string) => void;
}

export const SectionTabs = ({ tabs, selectedTab, onTabChange }: SectionTabsProps) => {
    return (
        <div className="flex flex-row justify-around w-full py-8 px-2">
            {tabs.map((tab) => {
                const isActive = selectedTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                        {/* Icon container */}
                        <div className={`relative w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 flex items-center justify-center transition-opacity duration-200 ${
                            isActive ? 'opacity-100' : 'opacity-60'
                        } hover:opacity-100`}>
                            <div className="absolute inset-0 flex items-center justify-center scale-[2.5] sm:scale-[2.3]">
                                <img
                                    src={tab.icon}
                                    alt={tab.label}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Label */}
                        <span className={`font-[family-name:var(--font-playfair)] text-shakespeare text-sm sm:text-base font-light tracking-wide transition-opacity duration-200 ${
                            isActive ? 'opacity-100' : 'opacity-60'
                        }`}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
