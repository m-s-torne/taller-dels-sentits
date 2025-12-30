import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export const useHeader = () => {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const servicesRef = useRef<HTMLLIElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 60) {
                setShow(false); // Oculta al hacer scroll hacia abajo
                setIsMenuOpen(false); // Cierra el menú al hacer scroll
                setIsServicesOpen(false); // Cierra el submenu de servicios
            } else {
                setShow(true); // Muestra al hacer scroll hacia arriba
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

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
        show,
        setIsMenuOpen,
        toggleMenu,
        isMenuOpen,
        isServicesOpen,
        toggleServices,
        setIsServicesOpen,
        servicesRef,
    }
}