import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, Users, Heart, Globe, Award, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              About <span className="text-primary">OffbeatTrips</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your trusted partner for extraordinary travel experiences worldwide
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                At OffbeatTrips, we believe that travel is not just about visiting places—it's about creating unforgettable memories, discovering new cultures, and experiencing the world in ways that transform you.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our mission is to curate exceptional travel experiences that go beyond the ordinary, connecting you with authentic adventures, luxury accommodations, and personalized service that makes every journey extraordinary.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Passion for Travel</h3>
                <p className="text-muted-foreground">
                  We're passionate travelers ourselves, and we bring that enthusiasm to every trip we plan.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Trust & Reliability</h3>
                <p className="text-muted-foreground">
                  Your safety and satisfaction are our top priorities. We ensure every detail is taken care of.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Authentic Experiences</h3>
                <p className="text-muted-foreground">
                  We focus on genuine cultural experiences that connect you with local communities.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in every aspect of your journey, from planning to execution.
                </p>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="mb-16">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  OffbeatTrips was born from a simple idea: travel should be transformative, not transactional. Founded by a team of passionate travelers and adventure enthusiasts, we set out to create a travel company that truly understands what makes a journey memorable.
                </p>
                <p>
                  What started as a small venture focused on off-the-beaten-path destinations has grown into a trusted platform offering everything from luxury resort stays to adventure-packed trips, all while maintaining our core commitment to authentic experiences and exceptional service.
                </p>
                <p>
                  Today, we're proud to have helped thousands of travelers discover new horizons, create lasting memories, and experience the world in ways they never imagined possible.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose OffbeatTrips?</h2>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6 flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Curated Destinations</h3>
                  <p className="text-muted-foreground">
                    We handpick every destination, ensuring you experience the best each place has to offer.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 flex items-start gap-4">
                <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Expert Team</h3>
                  <p className="text-muted-foreground">
                    Our team of travel experts has years of experience and local knowledge to make your trip perfect.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 flex items-start gap-4">
                <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground">
                    We're here for you around the clock, ensuring peace of mind throughout your journey.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-card border border-border rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Adventure?</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Let us help you plan your next unforgettable journey
            </p>
            <a
              href="/packages"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Explore Our Packages
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
