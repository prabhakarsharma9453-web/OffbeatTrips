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
    <section className="relative min-h-[80vh] overflow-hidden">
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
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20">
         {/* Mobile: Search Bar above heading */}
         <div className="block md:hidden mt-18 mb-20">
           <div className="w-full max-w-sm mx-auto ">
             <SearchBar />
           </div>
         </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center lg:min-h-[calc(80vh-200px)]">
          {/* Left Column */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 flex flex-col justify-center">
              <div className={`space-y-3 sm:space-y-4 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}>
                <h1 className="font-serif text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight text-center sm:text-left">
                  Discover the World’s Most
                  <br className="block sm:hidden" />
                  {" "}
                  Extraordinary Journeys
                  <span className="block sm:inline text-primary text-sm sm:text-lg md:text-xl">
                    {" "}
                    Handpicked adventures | hidden gems
                  </span>
                </h1>
              {/* <p className="text-base sm:text-lg text-white/70 max-w-md">
                Explore attractions, tours and more with our curated adventure packages
              </p> */}
            </div>

            {/* <div className={`${isVisible ? "animate-fade-in-left delay-200" : "opacity-0"}`}>
              <Link href="/activities/hiking">
                <Button size="lg" className="bg-white text-background hover:bg-white/90 gap-2 group px-6">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  View all hiking activities
                </Button>
              </Link>
            </div> */}

            
          </div>

          {/* Right Column */}
          {/* <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            Adventure Mood comment
            <div className={`${isVisible ? "animate-fade-in-right delay-100" : "opacity-0"}`}>
              <h3 className="text-white font-semibold mb-3 sm:mb-4">Start Your Journey</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {activities.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => setSelectedActivity(activity)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      selectedActivity === activity
                        ? "bg-white text-background"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            Featured Cards comment
            <div className={`${isVisible ? "animate-fade-in-right delay-300" : "opacity-0"}`}>
              <div className="flex gap-4 overflow-hidden">
                {featuredTrips.slice(currentSlide, currentSlide + 2).map((trip, index) => (
                  <div
                    key={trip.id}
                    className={`relative rounded-2xl overflow-hidden flex-1 min-w-[200px] h-[280px] group cursor-pointer ${
                      index === 0 ? "flex-[1.2]" : ""
                    }`}
                  >
                    <img
                      src={trip.image || "/placeholder.svg"}
                      alt={trip.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h4 className="text-white font-semibold text-lg">{trip.title}</h4>
                      <p className="text-white/60 text-sm">{trip.location}</p>
                    </div>
                  </div>
                ))}
              </div>

              Carousel Controls comment
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="ml-4 w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{
                      width: `${((currentSlide + 1) / (featuredTrips.length - 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div> */}
          
        </div>
        
      </div>


    </section>
  )
}
