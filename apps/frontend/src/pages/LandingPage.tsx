import { Header } from "@/components/landing/Header";
import { ScrollToHash } from "@/components/landing/ScrollToHash";
import { Hero } from "@/components/landing/Hero";
import { Domains } from "@/components/landing/Domains";
import { Products } from "@/components/landing/Products";
import { Solutions } from "@/components/landing/Solutions";
import { Features } from "@/components/landing/Features";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { Resources } from "@/components/landing/Resources";
import { About } from "@/components/landing/About";
import { Careers } from "@/components/landing/Careers";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <ScrollToHash />
      <Header />
      <Hero />
      <Domains />
      <Products />
      <Solutions />
      <Features />
      <DashboardPreview />
      <Testimonials />
      <Resources />
      <About />
      <Careers />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
