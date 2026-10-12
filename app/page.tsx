import { AiSection } from "@/components/landing/ai-section";
import { AssetMarquee } from "@/components/landing/asset-marquee";
import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesBento } from "@/components/landing/features-bento";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { StructuredData } from "@/components/seo/structured-data";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AssetMarquee />
        <FeaturesBento />
        <AiSection />
        <HowItWorks />
        <Pricing />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
      <StructuredData />
    </>
  );
}
