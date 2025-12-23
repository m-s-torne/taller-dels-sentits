"use client"
import { useEffect } from "react";
import HeroSection from "@/app/(home)/components/HeroSection";
import { ContentSection } from "@/app/(home)/components/ContentSection";
import Services from "@/app/(home)/components/Services";

export default function Home() {
  useEffect(() => {
    // Forzar scroll al top al cargar/recargar la página
    window.scrollTo(0, 0);
  }, []);

  return (
        <main>
            <HeroSection />

            <ContentSection />

            <Services />
        </main>
  )
}
