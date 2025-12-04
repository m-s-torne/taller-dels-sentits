import type { ContentStep } from '@/app/(home)/types/contentSection.types';

interface StepsNavigationProps {
    steps: ContentStep[];
    selectedStep: string;
    handleStepChange: (stepKey: string) => void;
}

const StepsNavigation = ({ steps, selectedStep, handleStepChange }: StepsNavigationProps) => {
    return (
        <div className="flex-1/4 flex flex-col items-center lg:items-start w-full lg:w-auto max-w-full overflow-hidden lg:overflow-visible">
            {/* Layout horizontal en mobile, vertical en desktop */}
            <div className="relative flex lg:flex-col flex-row justify-around lg:justify-between lg:h-full w-full lg:w-auto lg:min-h-[500px] pb-12 lg:pb-0 px-2 lg:px-0 overflow-hidden lg:overflow-visible">
                {/* Línea vertical en desktop */}
                <div className="hidden lg:block absolute w-2 bg-white" style={{
                    left: '6px',
                    top: '60px',
                    bottom: '60px',
                }}></div>
                
                {/* Línea horizontal en mobile - a la altura de los puntos */}
                <div className="block lg:hidden absolute bg-white h-1" style={{
                    left: 'calc(16.66% + 8px)',
                    right: 'calc(16.66% + 8px)',
                    top: '6px', // Centrada con los puntos (radio 8px / 2 - grosor 4px / 2)
                }}></div>
                
                {steps.map((step, index) => (
                    <div 
                        key={step.key}
                        className="flex lg:flex-row flex-col items-center gap-8 lg:gap-6 group relative z-10 shrink lg:flex-none max-w-[30%] lg:max-w-none cursor-pointer"
                        onClick={() => handleStepChange(step.key)}
                    >
                        {/* Punto indicador */}
                        <div className={`w-5 h-5 rounded-full border-2 border-white transition-all duration-200 relative z-10 shrink-0 ${
                            selectedStep === step.key ? 'bg-white' : 'bg-shakespeare'
                        }`}></div>
                        
                        {/* Contenedor de icono - área clickeable ceñida al SVG */}
                        <div className={`relative w-16 sm:w-20 md:w-24 lg:w-32 h-16 sm:h-20 md:h-24 lg:h-32 flex items-center justify-center transition-opacity duration-200 shrink-0 ${
                            selectedStep === step.key ? 'opacity-100' : 'opacity-60'
                        } group-hover:opacity-100`}>
                            <div className="absolute inset-0 flex items-center justify-center scale-[2.75] sm:scale-[2.6] md:scale-[2.3] lg:scale-[2.4]">
                                <img 
                                    src={step.icon} 
                                    alt={step.label} 
                                    className="w-full h-full object-contain filter"
                                />
                            </div>
                        </div>
                        
                        {/* Texto del paso - área clickeable ceñida al texto */}
                        <span className={`text-white text-2xl sm:text-3xl font-light tracking-wide transition-colors duration-200 whitespace-nowrap ${
                            selectedStep === step.key ? 'text-white' : 'text-white/70'
                        } group-hover:text-white`}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepsNavigation;
