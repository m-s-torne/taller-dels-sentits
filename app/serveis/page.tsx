"use client"
import { servicesData } from '@/app/_lib/servicesData';
import { ServiceSection } from './components/ServiceSection';
import { ServeisHero } from './components/ServeisHero';
import { useServicesScroll } from './hooks/useServicesScroll';

export default function Serveis () {
    useServicesScroll();

    return (
        <main>
            {/* Hero Section con fondo claro */}
            <ServeisHero />

            {/* Secciones de servicios */}
            {servicesData.map((service) => (
                <ServiceSection
                    key={service.id}
                    service={service}
                />
            ))}
        </main>
    )
}
