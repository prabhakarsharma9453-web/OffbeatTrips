"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search-bar"

const activities = ["Hiking", "Camping", "Ziplining", "Gliding", "Boat Charters"]

// Background images for each activity
const activityBackgrounds: Record<string, string> = {
  Hiking: "/majestic-mountain-landscape-with-blue-sky-adventur.jpg",
  Camping: "/camping-tent-nature-forest-night.jpg",
  Ziplining: "/valley-hiking-adventure-green-mountains.jpg",
  Gliding: "/paragliding-flying-sky-adventure.jpg",
  "Boat Charters": "/coastal-hiking-beach-cliffs-adventure.jpg",
}

const featuredTrips = [
  {
    id: 1,
    title: "Peak Ascent Challenge",
    image: "/rock-climbing-adventure-mountain.jpg",
    location: "Swiss Alps",
  },
  {
    id: 2,
    title: "Summit Hike Quest",
    image: "/beautiful-waterfall-nature-hiking.jpg",
    location: "Norway Fjords",
  },
  {
    id: 3,
    title: "Valley Explorer",
    image: "/valley-hiking-adventure-green-mountains.jpg",
    location: "New Zealand",
  },
  {
    id: 4,
    title: "Coastal Trek",
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    location: "Portugal",
  },
]

export default function HeroSection() {
  const [selectedActivity, setSelectedActivity] = useState("Hiking")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState(activityBackgrounds["Hiking"])
  const [nextBackgroundImage, setNextBackgroundImage] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Update background when activity changes with smooth transition
  useEffect(() => {
    const newImage = activityBackgrounds[selectedActivity] || activityBackgrounds["Hiking"]
    setNextBackgroundImage(newImage)
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setBackgroundImage(newImage)
      setNextBackgroundImage(null)
      setIsTransitioning(false)
    }, 2000) // Half of the 4s transition duration for smooth cross-fade
    return () => clearTimeout(timer)
  }, [selectedActivity])


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (featuredTrips.length - 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredTrips.length - 1) % (featuredTrips.length - 1))
  }

  return (
    <section className="relative min-h-[90vh] sm:min-h-[85vh] md:min-h-[80vh] overflow-hidden">
      {/* Background Images with Smooth Transition */}
      <div className="absolute inset-0">
        {/* Current Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
        {/* Next Background (for smooth fade) */}
        {nextBackgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${nextBackgroundImage}')`,
              opacity: isTransitioning ? 1 : 0,
              transition: "opacity 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          />
        )}
        {/* Gradient Overlays - Optimized for all screen sizes */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/55 sm:from-background/92 sm:via-background/65 sm:to-background/45 md:from-background/90 md:via-background/60 md:to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        {/* Mobile: Search Bar at top */}
        <div className="block md:hidden mb-6">
          <div className="w-full max-w-full mx-auto">
            <SearchBar />
          </div>
        </div>

        {/* Responsive Layout: Stacked on mobile, Grid on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start lg:items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-5 sm:space-y-6 lg:space-y-8 flex flex-col justify-center w-full order-1">
            <div className={`space-y-3 sm:space-y-4 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}>
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight text-center sm:text-left">
                Discover the World's Most
                <br className="block lg:hidden" />
                {" "}
                <span className="lg:inline">Extraordinary Journeys</span>
              </h1>
              <p className="text-primary text-sm sm:text-md md:text-lg lg:text-xl font-medium text-center sm:text-left mt-2 sm:mt-3">
                Handpicked adventures | hidden gems
              </p>
            </div>

            <div className={`flex justify-center sm:justify-start ${isVisible ? "animate-fade-in-left delay-200" : "opacity-0"}`}>
              <Link href="/activities/hiking">
                <Button size="lg" className="bg-white text-background hover:bg-white/90 gap-2 group px-4 sm:px-3 py-4 sm:py-4 text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  View all hiking activities
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Activities & Featured Trips */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 w-full order-2">
            {/* Start Your Journey Section */}
            <div className={`${isVisible ? "animate-fade-in-right delay-100" : "opacity-0"}`}>
              <h3 className="text-white font-semibold mb-4 sm:mb-5 text-center sm:text-left text-xl sm:text-2xl">Start Your Journey</h3>
              <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center sm:justify-start">
                {activities.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => setSelectedActivity(activity)}
                    className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all ${
                      selectedActivity === activity
                        ? "bg-white text-background shadow-lg scale-105"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:scale-105"
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Trips Carousel - Visible on all devices */}
            <div className={`${isVisible ? "animate-fade-in-right delay-300" : "opacity-0"}`}>
              <div className="flex gap-3 sm:gap-4 overflow-hidden">
                {featuredTrips.slice(currentSlide, currentSlide + 2).map((trip, index) => (
                  <Link
                    key={trip.id}
                    href="/packages"
                    className={`relative rounded-2xl overflow-hidden flex-1 min-w-[140px] sm:min-w-[180px] md:min-w-[200px] h-[200px] sm:h-[240px] md:h-[280px] group cursor-pointer transition-transform hover:scale-105 ${
                      index === 0 ? "flex-[1.2]" : ""
                    }`}
                  >
                    <img
                      src={trip.image || "/placeholder.svg"}
                      alt={trip.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h4 className="text-white font-semibold text-base sm:text-lg md:text-xl mb-1">{trip.title}</h4>
                      <p className="text-white/70 text-xs sm:text-sm">{trip.location}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  title="Previous slide"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  title="Next slide"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-95"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div className="ml-4 w-24 sm:w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{
                      width: `${((currentSlide + 1) / (featuredTrips.length - 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
