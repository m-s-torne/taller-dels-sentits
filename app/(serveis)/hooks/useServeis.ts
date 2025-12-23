import { servicesData } from "@/app/_lib/servicesData";
import { useEffect, useState } from "react";

export const useServeis = () => {
    const [quoteIndices, setQuoteIndices] = useState<Record<string, number>>({
        artterapia: 0,
        artperdins: 0
    });

    // Carousel automático para las citas
    useEffect(() => {
        const intervals = servicesData
            .filter(service => service.quotes.length > 0)
            .map(service => {
                return setInterval(() => {
                    setQuoteIndices(prev => ({
                        ...prev,
                        [service.id]: (prev[service.id] + 1) % service.quotes.length
                    }));
                }, 6000); // Cambia cada 6 segundos
            });

        return () => intervals.forEach(interval => clearInterval(interval));
    }, []);

    return quoteIndices;
}