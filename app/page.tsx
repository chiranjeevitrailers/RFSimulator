import Navigation from '@/components/marketing/Navigation';
import HeroSection from '@/components/marketing/HeroSection';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import HowItWorksSection from '@/components/marketing/HowItWorksSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}