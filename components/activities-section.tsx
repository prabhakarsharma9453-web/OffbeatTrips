"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Mountain, Tent, Ship, Plane, Waves, Snowflake, Bike, Camera, TreePine, PawPrint, Landmark, Compass, Sun, MapPin, Umbrella } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const activities = [
  {
    id: 1,
    name: "Hiking",
    slug: "hiking",
    icon: Mountain,
    image: "/hiking-adventure-mountain-trail.jpg",
  },
  {
    id: 2,
    name: "Camping",
    slug: "camping",
    icon: Tent,
    image: "/camping-tent-nature-forest-night.jpg",
  },
  {
    id: 3,
    name: "Water Sports",
    slug: "water-sports",
    icon: Waves,
    image: "/water-sports-kayaking-rafting-adventure.jpg",
  },
  {
    id: 4,
    name: "Paragliding",
    slug: "paragliding",
    icon: Plane,
    image: "/paragliding-flying-sky-adventure.jpg",
  },
  {
    id: 5,
    name: "Skiing",
    slug: "skiing",
    icon: Snowflake,
    image: "/skiing-snow-mountains-winter-sport.jpg",
  },
  {
    id: 6,
    name: "Cycling",
    slug: "cycling",
    icon: Bike,
    image: "/cycling-mountain-bike-trail-adventure.jpg",
  },
  {
    id: 7,
    name: "Cruises",
    slug: "cruises",
    icon: Ship,
    image: "/cruise-ship-ocean-travel-luxury.jpg",
  },
  {
    id: 8,
    name: "Photography Tours",
    slug: "photography-tours",
    icon: Camera,
    image: "/photography-tour-landscape-camera-nature.jpg",
  },
  {
    id: 9,
    name: "Wildlife",
    slug: "wildlife",
    icon: PawPrint,
    image: "/wildlife-safari-animal-watching.jpg",
  },
  {
    id: 10,
    name: "Heritage",
    slug: "heritage",
    icon: Landmark,
    image: "/heritage-cultural-historical-sites.jpg",
  },
  {
    id: 11,
    name: "Deserts",
    slug: "deserts",
    icon: Sun,
    image: "/desert-sand-dunes-camel-safari.jpg",
  },
  {
    id: 12,
    name: "Wilderness",
    slug: "wilderness",
    icon: TreePine,
    image: "/wilderness-nature-forest-exploration.jpg",
  },
  {
    id: 13,
    // name: "Lake",
    slug: "lake",
    icon: Waves,
    image: "/4.jpg",
  },
  {
    id: 14,
    name: "Adventure",
    slug: "adventure",
    icon: Compass,
    image: "/adventure-extreme-sports-outdoor.jpg",
  },
  {
    id: 15,
    name: "Beach",
    slug: "beach",
    icon: Umbrella,
    image: "/beach-coastal-tropical-paradise.jpg",
  },
  {
    id: 16,
    name: "Mountain",
    slug: "mountain",
    icon: Mountain,
    image: "/mountain-peak-summit-climbing.jpg",
  },
]

// Number of activities to show initially
const INITIAL_DISPLAY_COUNT = 8

export default function ActivitiesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [api, setApi] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  // Determine which activities to display
  const displayedActivities = showAll ? activities : activities.slice(0, INITIAL_DISPLAY_COUNT)
  const hasMoreActivities = activities.length > INITIAL_DISPLAY_COUNT

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-scroll for mobile only
  useEffect(() => {
    if (!api || !isMobile) return

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0) // Reset to start
      }
    }, 4000) // Auto-scroll every 4 seconds

    return () => clearInterval(interval)
  }, [api, isMobile])

  return (
    <section ref={sectionRef} id="activities" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-6 sm:mb-8 lg:mb-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
            Adventure by <span className="text-primary">Activity</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Choose your thrill - from serene hikes to adrenaline-pumping adventures
          </p>
        </div>

        {/* Mobile: Carousel with auto-scroll, Desktop: Grid */}
        <div className="block md:hidden">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {displayedActivities.map((activity, index) => (
                <CarouselItem key={activity.id} className="pl-2 basis-full">
                  <Link
                    href={`/activities/${activity.slug}`}
                    className={`relative group cursor-pointer block ${isVisible ? "animate-scale-in" : "opacity-0"}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onMouseEnter={() => setHoveredId(activity.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="relative h-40 sm:h-44 rounded-2xl overflow-hidden">
                      <img
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <activity.icon
                          className={`w-10 h-10 mb-2 transition-transform duration-300 ${
                            hoveredId === activity.id ? "scale-110 animate-float" : ""
                          }`}
                        />
                        <h3 className="font-semibold text-lg">{activity.name}</h3>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayedActivities.map((activity, index) => (
            <Link
              key={activity.id}
              href={`/activities/${activity.slug}`}
              className={`relative group cursor-pointer block ${isVisible ? "animate-scale-in" : "opacity-0"}`}
              style={{ animationDelay: `${index * 50}ms` }}
              onMouseEnter={() => setHoveredId(activity.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative h-44 lg:h-48 rounded-2xl overflow-hidden">
                <img
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <activity.icon
                    className={`w-10 h-10 mb-2 transition-transform duration-300 ${
                      hoveredId === activity.id ? "scale-110 animate-float" : ""
                    }`}
                  />
                  <h3 className=" font-bold text-lg">{activity.name}</h3>
                  {/* <p className="text-white/80 text-sm">{activity.trips} Trips</p> */}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        {hasMoreActivities && (
          <div className={`text-center mt-6 sm:mt-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50 transition-all duration-300 font-medium"
            >
              {showAll ? (
                <>
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <span>View More Activities</span>
                  <span className="text-sm">({activities.length - INITIAL_DISPLAY_COUNT} more)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
