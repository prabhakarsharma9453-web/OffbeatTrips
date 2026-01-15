"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Mountain, Tent, Ship, Plane, Waves, Snowflake, Bike, Camera } from "lucide-react"
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
    trips: 45,
    image: "/hiking-adventure-mountain-trail.jpg",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 2,
    name: "Camping",
    slug: "camping",
    icon: Tent,
    trips: 32,
    image: "/camping-tent-nature-forest-night.jpg",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: 3,
    name: "Water Sports",
    slug: "water-sports",
    icon: Waves,
    trips: 28,
    image: "/water-sports-kayaking-rafting-adventure.jpg",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: 4,
    name: "Paragliding",
    slug: "paragliding",
    icon: Plane,
    trips: 18,
    image: "/paragliding-flying-sky-adventure.jpg",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 5,
    name: "Skiing",
    slug: "skiing",
    icon: Snowflake,
    trips: 24,
    image: "/placeholder.svg?height=300&width=400",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: 6,
    name: "Cycling",
    slug: "cycling",
    icon: Bike,
    trips: 36,
    image: "/placeholder.svg?height=300&width=400",
    color: "from-lime-500 to-green-600",
  },
  {
    id: 7,
    name: "Cruises",
    slug: "cruises",
    icon: Ship,
    trips: 15,
    image: "/placeholder.svg?height=300&width=400",
    color: "from-indigo-500 to-violet-600",
  },
  {
    id: 8,
    name: "Photography Tours",
    slug: "photography-tours",
    icon: Camera,
    trips: 22,
    image: "/placeholder.svg?height=300&width=400",
    color: "from-rose-500 to-red-600",
  },
]

export default function ActivitiesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [api, setApi] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
              {activities.map((activity, index) => (
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
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${activity.color} opacity-70 group-hover:opacity-80 transition-opacity`}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <activity.icon
                          className={`w-10 h-10 mb-2 transition-transform duration-300 ${
                            hoveredId === activity.id ? "scale-110 animate-float" : ""
                          }`}
                        />
                        <h3 className="font-semibold text-lg">{activity.name}</h3>
                        <p className="text-white/80 text-sm">{activity.trips} Trips</p>
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
          {activities.map((activity, index) => (
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
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${activity.color} opacity-70 group-hover:opacity-80 transition-opacity`}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <activity.icon
                    className={`w-10 h-10 mb-2 transition-transform duration-300 ${
                      hoveredId === activity.id ? "scale-110 animate-float" : ""
                    }`}
                  />
                  <h3 className="font-semibold text-lg">{activity.name}</h3>
                  <p className="text-white/80 text-sm">{activity.trips} Trips</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
