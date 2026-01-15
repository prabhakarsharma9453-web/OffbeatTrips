"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Globe, MapPin, Clock, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const internationalPackages = [
  {
    id: 1,
    title: "Swiss Alps Explorer",
    location: "Switzerland",
    duration: "7 Days",
    price: "$2,499",
    rating: 4.9,
    image: "/swiss-alps-mountains-snow-travel.jpg",
    highlights: ["Mountain Hiking", "Scenic Train", "Glacier Walk"],
  },
  {
    id: 2,
    title: "Norwegian Fjords",
    location: "Norway",
    duration: "6 Days",
    price: "$2,199",
    rating: 4.8,
    image: "/norway-fjords-beautiful-water-mountains.jpg",
    highlights: ["Fjord Cruise", "Northern Lights", "Ice Climbing"],
  },
  {
    id: 3,
    title: "Thailand Paradise",
    location: "Thailand",
    duration: "5 Days",
    price: "$1,299",
    rating: 4.7,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    highlights: ["Island Hopping", "Snorkeling", "Thai Cuisine"],
  },
  {
    id: 7,
    title: "Bali Adventure",
    location: "Indonesia",
    duration: "6 Days",
    price: "$1,599",
    rating: 4.8,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    highlights: ["Volcano Trek", "Beach Hopping", "Cultural Tours"],
  },
  {
    id: 11,
    title: "Paris Romance",
    location: "France",
    duration: "5 Days",
    price: "$2,299",
    rating: 4.9,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    highlights: ["Eiffel Tower", "Louvre Museum", "Fine Dining"],
  },
  {
    id: 12,
    title: "Iceland Adventure",
    location: "Iceland",
    duration: "7 Days",
    price: "$2,799",
    rating: 4.8,
    image: "/beautiful-waterfall-nature-hiking.jpg",
    highlights: ["Northern Lights", "Glacier Hiking", "Hot Springs"],
  },
]

const domesticPackages = [
  {
    id: 4,
    title: "Ladakh Adventure",
    location: "Ladakh, India",
    duration: "8 Days",
    price: "₹45,999",
    rating: 4.9,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    highlights: ["Pangong Lake", "Nubra Valley", "Monastery Tour"],
  },
  {
    id: 5,
    title: "Kerala Backwaters",
    location: "Kerala, India",
    duration: "5 Days",
    price: "₹28,999",
    rating: 4.8,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    highlights: ["Houseboat Stay", "Ayurveda Spa", "Tea Plantations"],
  },
  {
    id: 6,
    title: "Manali Expedition",
    location: "Himachal Pradesh",
    duration: "4 Days",
    price: "₹18,999",
    rating: 4.7,
    image: "/manali-mountains-snow-adventure-himachal.jpg",
    highlights: ["Solang Valley", "Rohtang Pass", "River Rafting"],
  },
  {
    id: 8,
    title: "Rajasthan Royal",
    location: "Rajasthan, India",
    duration: "6 Days",
    price: "₹32,999",
    rating: 4.9,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    highlights: ["Palace Tour", "Desert Safari", "Cultural Shows"],
  },
  {
    id: 13,
    title: "Goa Beach Escape",
    location: "Goa, India",
    duration: "4 Days",
    price: "₹22,999",
    rating: 4.8,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    highlights: ["Beach Activities", "Water Sports", "Nightlife"],
  },
  {
    id: 14,
    title: "Darjeeling Tea Trails",
    location: "West Bengal",
    duration: "5 Days",
    price: "₹26,999",
    rating: 4.7,
    image: "/swiss-alps-mountains-snow-travel.jpg",
    highlights: ["Tea Gardens", "Toy Train", "Sunrise Views"],
  },
]

export default function PackagesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [internationalApi, setInternationalApi] = useState<any>(null)
  const [domesticApi, setDomesticApi] = useState<any>(null)
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

  // Auto-scroll for mobile only - International
  useEffect(() => {
    if (!internationalApi || !isMobile) return

    const interval = setInterval(() => {
      if (internationalApi.canScrollNext()) {
        internationalApi.scrollNext()
      } else {
        internationalApi.scrollTo(0) // Reset to start
      }
    }, 4000) // Auto-scroll every 4 seconds

    return () => clearInterval(interval)
  }, [internationalApi, isMobile])

  // Auto-scroll for mobile only - Domestic
  useEffect(() => {
    if (!domesticApi || !isMobile) return

    const interval = setInterval(() => {
      if (domesticApi.canScrollNext()) {
        domesticApi.scrollNext()
      } else {
        domesticApi.scrollTo(0) // Reset to start
      }
    }, 4000) // Auto-scroll every 4 seconds

    return () => clearInterval(interval)
  }, [domesticApi, isMobile])

  const PackageCard = ({ pkg, index }: { pkg: (typeof internationalPackages)[0]; index: number }) => (
    <div
      className={`group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 h-full ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.image || "/placeholder.svg"}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-white text-sm font-medium">{pkg.rating}</span>
        </div>
      </div>
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-1.5 sm:mb-2">
          <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          {pkg.location}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{pkg.title}</h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {pkg.highlights.map((highlight) => (
            <span key={highlight} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
              {highlight}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-primary">{pkg.price}</p>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pkg.duration}
            </p>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs sm:text-sm px-3 sm:px-4">
            View Details
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <section ref={sectionRef} id="packages" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-6 sm:mb-8 lg:mb-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
            Explore Our <span className="text-primary">Packages</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Discover handcrafted travel experiences designed for adventure seekers and wanderlust souls
          </p>
        </div>

        <Tabs defaultValue="international" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 sm:mb-8 lg:mb-8 bg-muted">
            <TabsTrigger
              value="international"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Globe className="w-4 h-4" />
              International
            </TabsTrigger>
            <TabsTrigger
              value="domestic"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <MapPin className="w-4 h-4" />
              Domestic
            </TabsTrigger>
          </TabsList>

          <TabsContent value="international" className="mt-0">
            <Carousel
              setApi={setInternationalApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {internationalPackages.map((pkg, index) => (
                  <CarouselItem key={pkg.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                    <PackageCard pkg={pkg} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
              <CarouselNext className="hidden md:flex -right-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
            </Carousel>
          </TabsContent>

          <TabsContent value="domestic" className="mt-0">
            <Carousel
              setApi={setDomesticApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {domesticPackages.map((pkg, index) => (
                  <CarouselItem key={pkg.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                    <PackageCard pkg={pkg} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
              <CarouselNext className="hidden md:flex -right-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
            </Carousel>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6 sm:mt-8 lg:mt-8">
          <Link href="/packages">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              View All Packages
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
