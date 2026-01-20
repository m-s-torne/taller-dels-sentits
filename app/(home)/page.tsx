"use client"
import HeroSection from "@/app/(home)/components/HeroSection";
import { ContentSection } from "@/app/(home)/components/ContentSection";
import Services from "@/app/(home)/components/Services";
import { useScrollToTop } from "@/app/_hooks/useScrollToTop";

export default function Home() {
  useScrollToTop();

  return (
        <main>
            <HeroSection />

            <ContentSection />

            <Services />
        </main>
  )
}
