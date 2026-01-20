import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ContactSection from "@/components/contact-section"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get in touch with us. We're here to help you plan your perfect trip!
            </p>
          </div>
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
