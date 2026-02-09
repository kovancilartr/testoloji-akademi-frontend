"use client";

import { useAuth } from "@/contexts/AuthContext";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import GlobalHeader from "@/components/ui/custom-ui/GlobalHeader";
import { ScrollToTop } from "@/components/ui/custom-ui/ScrollToTop";
import GlobalFooter from "@/components/ui/custom-ui/GlobalFooter";
import HeroSection from "@/components/ui/custom-ui/HeroSection";
import StatsSection from "@/components/ui/custom-ui/StatsSection";
import FeaturesSection from "@/components/ui/custom-ui/FeaturesSection";
import PricingTableSection from "@/components/ui/custom-ui/PricingTableSection";
import CtaSection from "@/components/ui/custom-ui/CtaSection";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-white selection:bg-brand-100 selection:text-brand-900">
      {/* Navbar */}
      <GlobalHeader isAuthenticated={isAuthenticated} />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Stats */}
        <StatsSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Pricing Table */}
        <PricingTableSection />

        {/* CTA Section */}
        <CtaSection />
      </main>

      <GlobalFooter />

      <ScrollToTop />
    </div>
  );
}
