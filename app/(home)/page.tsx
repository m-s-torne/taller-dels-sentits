import HeroSection from "@/app/(home)/components/HeroSection";
import { ContentSection } from "@/app/(home)/components/ContentSection";
import Services from "@/app/(home)/components/Services";

export default function Home() {
  return (
        <main className="overflow-x-hidden">
            <HeroSection/>

            <ContentSection />

            <Services />
        </main>
  )
}
