import Navigation from '@/components/marketing/Navigation';
import HeroSection from '@/components/marketing/HeroSection';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import EquipmentSection from '@/components/marketing/EquipmentSection';
import ServiceSection from '@/components/marketing/ServiceSection';
import HowItWorksSection from '@/components/marketing/HowItWorksSection';
import TestimonialsSection from '@/components/marketing/TestimonialsSection';
import SocialProofSection from '@/components/marketing/SocialProofSection';
import PricingSection from '@/components/marketing/PricingSection';
import Footer from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <EquipmentSection />
      <ServiceSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <SocialProofSection />
      <PricingSection />
      <Footer />
    </main>
  );
}