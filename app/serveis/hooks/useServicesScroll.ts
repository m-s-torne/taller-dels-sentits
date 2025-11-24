import { useEffect } from "react";

export const useServicesScroll = () => {
    useEffect(() => {
        // Scroll to section if hash is present
        const hash = window.location.hash;

        if (hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                setTimeout(() => {
                    const headerOffset = 100; // Altura aproximada del header + margen
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }, [location]);

    return null;
}