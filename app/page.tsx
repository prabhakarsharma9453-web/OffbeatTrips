import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import SearchBar from "@/components/search-bar"
import PackagesSection from "@/components/packages-section"
import FeaturesSection from "@/components/features-section"
import LuxuryResortsSection from "@/components/luxury-resorts-section"
import StatsSection from "@/components/stats-section"
import ActivitiesSection from "@/components/activities-section"
import LocationsSection from "@/components/locations-section"
import TestimonialsSection from "@/components/testimonials-section"
import BlogSection from "@/components/blog-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      {/* Desktop: Search Bar after hero */}
      <div className="hidden md:block">
        <SearchBar />
      </div>
      <PackagesSection />
      <FeaturesSection />
      <LuxuryResortsSection />
      <StatsSection />
      <ActivitiesSection />
      <LocationsSection />
      <TestimonialsSection />
      <BlogSection />
      {/* <ContactSection /> */}
      <Footer />
    </main>
  )
}
