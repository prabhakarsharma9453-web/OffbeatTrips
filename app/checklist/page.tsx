"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { CheckCircle2, ArrowRight } from "lucide-react"

const checklistItems = [
  "Location & Accessibility",
  "Luxury Amenities & Facilities",
  "Room Quality & Comfort",
  "Dining Options & Cuisine",
  "Spa & Wellness Facilities",
  "Staff Service & Hospitality",
  "Safety & Security Measures",
  "Environmental Standards",
  "Guest Reviews & Ratings",
  "Value for Money",
  "Unique Experiences Offered",
  "Cultural Authenticity",
]

export default function ChecklistPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-medium">Resort Selection Criteria</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              12+ Checklist for <span className="text-primary">Resort Selection</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We meticulously evaluate every resort across multiple criteria to ensure you receive nothing but the best travel experience
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-6">
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-white font-medium flex-1">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-primary/10 border border-primary/20 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-3">Our Commitment</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every resort in our collection undergoes rigorous evaluation based on these 12+ essential criteria. 
                We personally inspect locations, test amenities, and verify services to guarantee that your stay 
                exceeds expectations. Your perfect getaway deserves nothing less than our meticulous attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
