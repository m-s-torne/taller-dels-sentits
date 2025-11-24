import type { RefObject, ReactNode } from 'react';
import type { ContentData } from '@/app/types/contentSection.types';

interface ContentDisplayProps {
    currentContent: ContentData;
    textRef: RefObject<HTMLDivElement | null>;
    triangleRotation: string;
    renderTitle: () => ReactNode;
    renderTextParagraphs: () => ReactNode;
    handleArrowClick: () => void;
}

const ContentDisplay = ({
    currentContent,
    textRef,
    triangleRotation,
    renderTitle,
    renderTextParagraphs,
    handleArrowClick
}: ContentDisplayProps) => {
    return (
        <div className="lg:flex-1/2 flex-1 w-full lg:w-auto">
            {/* Separador superior */}
            <div className="border-t-4 border-white max-w-lg mx-8 md:mx-auto mb-5"></div>
            
            {/* Contenedor con bordes como en la maqueta */}
            <div className="justify-center border-3 border-white rounded-[40px] px-4 sm:px-8 md:px-10 py-3 text-center">
                {/* Título principal centrado */}
                <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-light tracking-wide leading-relaxed mb-8">
                    {renderTitle()}
                </h2>

                {/* Cita centrada */}
                <div className="mb-8">
                    <p className="text-white text-lg italic mb-2">
                        {currentContent.quote}
                    </p>
                    <p className="text-white text-base">
                        {currentContent.author}
                    </p>
                </div>

                {/* Línea decorativa */}
                <div className="border-t-2 border-white max-w-md mx-auto mb-8"></div>

                {/* Texto descriptivo con overflow y scroll interno */}
                <div 
                    ref={textRef}
                    className="text-white text-sm sm:text-base lg:text-lg leading-relaxed max-w-md mx-auto text-left h-[13rem] md:h-56 no-user-scroll relative"
                    style={{
                        scrollbarWidth: 'none',
                    }}
                >
                    {renderTextParagraphs()}
                </div>

                {/* Flecha hacia abajo/arriba clickeable */}
                <div className="mt-8 text-center">
                    <button 
                        onClick={handleArrowClick}
                        className="text-white hover:text-white/70 cursor-pointer"
                    >
                        <div 
                            className="transform transition-all duration-300 ease-out hover:scale-110"
                            style={{
                                transform: triangleRotation
                            }}
                        >
                            {/* Triángulo hacia abajo - relleno sólido */}
                            <svg 
                                width="40" 
                                height="16" 
                                viewBox="0 0 40 16" 
                                fill="currentColor" 
                                className="mx-auto"
                            >
                                <path d="M20 14L38 2L2 2Z" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
            
            {/* Separador inferior */}
            <div className="border-t-4 border-white max-w-lg mx-8 md:mx-auto mt-5"></div>
        </div>
    );
};

export default ContentDisplay;
