import { ApproachSection } from "@/components/site/ApproachSection";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { ServicesSection } from "@/components/site/ServicesSection";
import { StudioSection } from "@/components/site/StudioSection";
import { WorkSection } from "@/components/site/WorkSection";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        <WorkSection />
        <ApproachSection />
        <StudioSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
