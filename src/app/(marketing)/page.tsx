import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DashboardPreviewSection from "@/components/landing/DashboardPreviewSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-white">
      <HeroSection />
      <FeaturesSection />
      <DashboardPreviewSection />
      <TestimonialsSection />
      
      {/* Bottom CTA Area before Footer */}
      <section className="py-24 text-center px-6 bg-zinc-50 border-t border-zinc-100">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Şimdi Ücretsiz Demo İsteyin!</h2>
        <p className="text-zinc-600 mb-8 max-w-lg mx-auto">
          Büyük ölçekli tarım işletmeniz için en iyi çözümle tanışın.
        </p>
        <a 
          href="/dashboard"
          className="inline-block px-8 py-4 rounded-xl bg-primary-green text-white font-medium text-lg hover:bg-primary-green-hover transition-colors shadow-md"
        >
          Ücretsiz Demo İste
        </a>
      </section>
    </div>
  );
}
