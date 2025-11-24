import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useHeader = () => {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 60) {
                setShow(false); // Oculta al hacer scroll hacia abajo
                setIsMenuOpen(false); // Cierra el menú al hacer scroll
            } else {
                setShow(true); // Muestra al hacer scroll hacia arriba
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return {
        show,
        setIsMenuOpen,
        toggleMenu,
        isMenuOpen,
    }
}