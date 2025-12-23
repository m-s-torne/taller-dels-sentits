import type { RefObject, ReactNode } from 'react';
import type { ContentData } from '@/app/(home)/types/contentSection.types';
import { TriangleButton } from '@/app/_components/ui/TriangleButton';

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
            <div className="border-t-4 border-lilac mx-10 mb-5"></div>
            
            {/* Contenedor con bordes como en la maqueta */}
            <div className="justify-center border-[3px] border-white rounded-[40px] px-4 sm:px-8 md:px-10 py-3 text-center">
                {/* Título principal centrado */}
                <h2 className="text-lilac! text-xl sm:text-2xl lg:text-4xl mx-5 font-light tracking-wide leading-relaxed mb-8">
                    {renderTitle()}
                </h2>

                {/* Cita centrada */}
                <div className="mb-8">
                    <p className="text-lilac! text-lg italic mb-2">
                        {currentContent.quote}
                    </p>
                    <p className="text-lilac! text-base">
                        {currentContent.author}
                    </p>
                </div>

                {/* Línea decorativa */}
                <div className="border-t-2 border-white max-w-md mx-auto mb-4"></div>

                {/* Contenedor con gradientes de difuminado */}
                <div className="relative max-w-md mx-auto">
                    {/* Texto descriptivo con overflow y scroll interno */}
                    <div
                        ref={textRef}
                        className="text-lilac! text-sm sm:text-base lg:text-lg leading-relaxed text-left h-52 md:h-56 no-user-scroll relative py-3"
                        style={{
                            scrollbarWidth: 'none',
                        }}
                    >
                        {renderTextParagraphs()}
                    </div>
                    
                    {/* Gradiente superior */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-shakespeare to-transparent pointer-events-none"></div>
                    
                    {/* Gradiente inferior */}
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-shakespeare to-transparent pointer-events-none"></div>
                </div>

                {/* Flecha hacia abajo/arriba clickeable */}
                <div className="mt-8 text-center">
                    <TriangleButton 
                        triangleRotation={triangleRotation}
                        onClick={handleArrowClick}
                    />
                </div>
            </div>
            
            {/* Separador inferior */}
            <div className="border-t-4 border-white mx-10 mt-5"></div>
        </div>
    );
};

export default ContentDisplay;
