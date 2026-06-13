import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HeroSection } from "@/components/home/HeroSection";
import { HorecaCTA } from "@/components/home/HorecaCTA";
import { TrustSection } from "@/components/home/TrustSection";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
        <TrustSection />
        <HorecaCTA />
      </main>
      <Footer />
    </div>
  );
}
