"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { MapPin, CheckCircle2, Globe, Map, Award } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const features = [
  {
    id: 1,
    icon: MapPin,
    text: "650+ Verified Handpicked Resorts",
    iconColor: "text-red-500",
    href: "/resorts",
  },
  {
    id: 2,
    icon: CheckCircle2,
    text: "12+ Checklist for Resort selection",
    iconColor: "text-green-500",
    href: "/checklist",
  },
  {
    id: 3,
    icon: Globe,
    text: "30+ International Destinations",
    iconColor: "text-blue-500",
    href: "/destinations/international",
  },
  {
    id: 4,
    icon: Map,
    text: "100+ Domestic Destinations",
    iconColor: "text-purple-500",
    href: "/destinations/domestic",
  },
  {
    id: 5,
    icon: Award,
    text: "100+ Curated Experiences",
    iconColor: "text-amber-500",
    href: "/experiences",
  },
]

export default function FeaturesSection() {
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
    <section ref={sectionRef} className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-4 sm:mb-6 lg:mb-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white uppercase tracking-wide">
          The OffbeatTrips Standards
          </h2>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <CarouselItem key={feature.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/5">
                  <Link
                    href={feature.href}
                    className="text-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-3 sm:p-4 lg:p-5 hover:border-primary/50 transition-all duration-300 cursor-pointer block h-full"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-2 sm:mb-3">
                        <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.iconColor}`} />
                      </div>
                      <p className="text-white text-xs sm:text-sm font-medium leading-relaxed">{feature.text}</p>
                    </div>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
          <CarouselNext className="hidden md:flex -right-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
        </Carousel>
      </div>
    </section>
  )
}
