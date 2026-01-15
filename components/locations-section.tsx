"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const locations = [
  {
    id: 1,
    name: "Switzerland",
    country: "Europe",
    trips: 12,
    image: "/switzerland-alps-beautiful-scenery.jpg",
    slug: "Switzerland",
  },
  {
    id: 2,
    name: "Norway",
    country: "Europe",
    trips: 8,
    image: "/norway-fjords-beautiful-water-mountains.jpg",
    slug: "Norway",
  },
  {
    id: 3,
    name: "Ladakh",
    country: "India",
    trips: 15,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    slug: "Ladakh",
  },
  {
    id: 4,
    name: "Thailand",
    country: "Asia",
    trips: 10,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    slug: "Thailand",
  },
  {
    id: 5,
    name: "New Zealand",
    country: "Oceania",
    trips: 9,
    image: "/new-zealand-mountains-nature-scenic.jpg",
    slug: "New-Zealand",
  },
  {
    id: 6,
    name: "Manali",
    country: "India",
    trips: 18,
    image: "/manali-mountains-snow-adventure-himachal.jpg",
    slug: "Manali",
  },
]

export default function LocationsSection() {
  const [isVisible, setIsVisible] = useState(false)
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
    <section ref={sectionRef} id="destinations" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-6 sm:mb-8 lg:mb-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
            Popular <span className="text-primary">Destinations</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Explore the world most breathtaking locations curated just for you
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
              {locations.map((location, index) => (
                <CarouselItem key={location.id} className="pl-2 basis-full">
                  <Link
                    href={`/trips/${location.slug}`}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer block ${
                      isVisible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={location.image || "/placeholder.svg"}
                        alt={location.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                          <MapPin className="w-4 h-4" />
                          {location.country}
                        </div>
                        <h3 className="text-lg font-semibold text-white">{location.name}</h3>
                        <p className="text-white/60 text-sm">{location.trips} Trips Available</p>
                      </div>
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 lg:gap-6">
          {locations.map((location, index) => (
            <Link
              key={location.id}
              href={`/trips/${location.slug}`}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer block ${
                index === 0 || index === 3 ? "md:row-span-2" : ""
              } ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`relative ${index === 0 || index === 3 ? "h-full min-h-[400px]" : "h-44 lg:h-48"}`}>
                <img
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    {location.country}
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-white">{location.name}</h3>
                  <p className="text-white/60 text-sm">{location.trips} Trips Available</p>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6 sm:mt-8 lg:mt-8">
          <Link href="/destinations">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              Explore All Destinations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
