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
            <div className="relative flex lg:flex-col flex-row justify-around lg:justify-start lg:h-full w-full lg:w-auto lg:min-h-[500px] pb-12 lg:pb-0 px-2 lg:px-0">
                {/* Línea vertical en desktop */}
                <div className="hidden lg:block absolute w-1 bg-white" style={{
                    left: '6px',
                    top: '100px',
                    bottom: '100px',
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
                        className="flex lg:flex-row flex-col items-center gap-1 lg:gap-6 cursor-pointer group relative z-10 shrink lg:flex-none max-w-[30%] lg:max-w-none"
                        onClick={() => handleStepChange(step.key)}
                        style={{
                            marginTop: index === 0 ? '0' : 'auto',
                            marginBottom: index === steps.length - 1 ? '0' : 'auto'
                        }}
                    >
                        {/* Punto indicador */}
                        <div className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-200 relative z-10 shrink-0 ${
                            selectedStep === step.key ? 'bg-white' : 'bg-shakespeare'
                        }`}></div>
                        
                        {/* Contenedor de icono y texto en columna para mobile */}
                        <div className="flex flex-col items-center lg:flex-row lg:gap-0 w-full">
                            {/* Icono */}
                            <div className={`w-48 max-w-[70vw] sm:w-36 md:w-40 lg:w-70 aspect-square flex items-center justify-center transition-opacity duration-200 shrink-0 -mb-10 lg:mb-0 ${
                                selectedStep === step.key ? 'opacity-100' : 'opacity-60'
                            } group-hover:opacity-100`}>
                                <img src={step.icon} alt={step.label} className="w-full h-full object-contain filter "/>
                            </div>
                            
                            {/* Texto del paso */}
                            <span className={`text-white text-sm sm:text-base lg:text-base font-medium tracking-wide transition-colors duration-200 whitespace-nowrap ${
                                selectedStep === step.key ? 'text-white' : 'text-white/70'
                            } group-hover:text-white`}>
                                {step.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepsNavigation;
