"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Award, Sparkles, Crown, Heart, Stars, Zap, Wine, UtensilsCrossed, Waves, Mountain } from "lucide-react"

const luxuryExperiences = [
  {
    icon: Crown,
    title: "Premium Accommodations",
    description: "Stay in handpicked luxury resorts and hotels that exceed international standards, featuring world-class amenities and breathtaking views.",
    image: "/swiss-alps-mountains-snow-travel.jpg",
  },
  {
    icon: Heart,
    title: "Personalized Service",
    description: "Experience dedicated concierge services and personalized attention from our team, ensuring every detail of your journey is perfect.",
    image: "/thailand-beach-islands-tropical-paradise.jpg",
  },
  {
    icon: Stars,
    title: "Exclusive Access",
    description: "Gain access to private beaches, exclusive events, and VIP experiences that are reserved only for our distinguished guests.",
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
  },
  {
    icon: Zap,
    title: "Curated Activities",
    description: "Enjoy carefully selected activities and excursions that showcase the best of each destination, from cultural immersions to adventure sports.",
    image: "/beautiful-waterfall-nature-hiking.jpg",
  },
  {
    icon: UtensilsCrossed,
    title: "Fine Dining Experiences",
    description: "Savor gourmet cuisine at award-winning restaurants and private dining experiences, featuring local and international flavors.",
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
  },
  {
    icon: Waves,
    title: "Wellness & Spa",
    description: "Rejuvenate with world-class spa treatments, wellness programs, and relaxation experiences designed to refresh your mind and body.",
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
  },
]

const heroImages = [
  "/swiss-alps-mountains-snow-travel.jpg",
  "/thailand-beach-islands-tropical-paradise.jpg",
  "/coastal-hiking-beach-cliffs-adventure.jpg",
]

export default function ExperiencesPage() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Image Carousel */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImages[currentImage] || "/placeholder.svg"}
            alt="Luxury Experience"
            className="w-full h-full object-cover transition-opacity duration-1000"
            key={currentImage}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-medium">100+ Curated Experiences</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl">
              We Will Make Your Holiday <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Special</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg max-w-3xl leading-relaxed">
              By providing you with luxurious experiences that create unforgettable memories. 
              Every moment of your journey is carefully crafted to exceed your expectations.
            </p>
          </div>
        </div>
        
        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentImage === index ? "w-8 bg-primary" : "w-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              What Luxury Experiences We Will <span className="text-primary">Provide To You</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-4xl mx-auto leading-relaxed">
              Our commitment to excellence ensures that every aspect of your travel experience is nothing short of extraordinary. 
              From the moment you begin planning until you return home, we provide unparalleled luxury and attention to detail.
            </p>
          </div>

          {/* Luxury Experiences Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {luxuryExperiences.map((experience, index) => {
              const IconComponent = experience.icon
              return (
                <div
                  key={index}
                  className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary transition-colors">
                      {experience.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{experience.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Additional Luxury Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="relative rounded-3xl overflow-hidden group">
              <div className="relative h-full min-h-[400px]">
                <img
                  src="/thailand-beach-islands-tropical-paradise.jpg"
                  alt="Luxury Travel"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <Sparkles className="w-8 h-8 text-primary mb-3" />
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    Unmatched Luxury
                  </h3>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    Every detail is meticulously planned to ensure your comfort, satisfaction, and unforgettable memories.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden group">
              <div className="relative h-full min-h-[400px]">
                <img
                  src="/coastal-hiking-beach-cliffs-adventure.jpg"
                  alt="Premium Service"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <Crown className="w-8 h-8 text-primary mb-3" />
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    Premium Service
                  </h3>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    Our dedicated team works tirelessly to provide you with personalized service that exceeds expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="relative rounded-3xl overflow-hidden">
            <div className="relative h-full min-h-[300px]">
              <img
                src="/swiss-alps-mountains-snow-travel.jpg"
                alt="Your Journey"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-secondary/90" />
              <div className="relative z-10 p-8 md:p-12 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Your Journey, Elevated
                </h3>
                <p className="text-white/95 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-6">
                  At OffbeatTrips, we don't just plan vacations—we craft extraordinary experiences. 
                  Each luxury experience is designed to create lasting memories and provide you with 
                  the kind of travel that transforms not just your destination, but your perspective.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                    <p className="text-white text-sm font-medium">24/7 Concierge Support</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                    <p className="text-white text-sm font-medium">Custom Itineraries</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                    <p className="text-white text-sm font-medium">Exclusive Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
