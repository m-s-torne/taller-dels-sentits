import HeroSection from "@/app/(home)/components/HeroSection";
import { ContentSection } from "@/app/(home)/components/ContentSection";
import Services from "@/app/(home)/components/Services";

export default function Home() {
  return (
        <main>
            <HeroSection/>

            <ContentSection />

            <Services />
        </main>
  )
}
