import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useScroll, useMotionValueEvent, useMotionValue, animate } from "motion/react";

export const useHeader = () => {
    const headerY = useMotionValue(0);
    const headerOpacity = useMotionValue(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const servicesRef = useRef<HTMLLIElement>(null);
    const pathname = usePathname();

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (current) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (current > previous && current > 60) {
            animate(headerY, -100, { type: 'spring', stiffness: 300, damping: 30 });
            animate(headerOpacity, 0, { duration: 0.15 });
            if (isMenuOpen) setIsMenuOpen(false);
            if (isServicesOpen) setIsServicesOpen(false);
        } else {
            animate(headerY, 0, { type: 'spring', stiffness: 300, damping: 30 });
            animate(headerOpacity, 1, { duration: 0.15 });
        }
    });

    // Close menus when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setIsServicesOpen(false);
    }, [pathname]);

    // Cerrar el menú de servicios al hacer click fuera (solo en desktop)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
                setIsServicesOpen(false);
            }
        };

        // Solo activar el listener si el menú móvil NO está abierto
        if (isServicesOpen && !isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isServicesOpen, isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsServicesOpen(false); // Cierra servicios al abrir/cerrar menu principal
    };

    const toggleServices = () => {
        setIsServicesOpen(!isServicesOpen);
    };

    return {
        headerY,
        headerOpacity,
        setIsMenuOpen,
        toggleMenu,
        isMenuOpen,
        isServicesOpen,
        toggleServices,
        setIsServicesOpen,
        servicesRef,
    }
}