"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Globe, MapPin, Star, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Resort interface
interface Resort {
  id: string
  title: string
  location: string
  price: string
  rating: number
  image: string
  amenities: string[]
  featured?: boolean
  popular?: boolean
  type?: 'domestic' | 'international'
}

export default function LuxuryResortsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [internationalApi, setInternationalApi] = useState<any>(null)
  const [domesticApi, setDomesticApi] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [internationalResorts, setInternationalResorts] = useState<Resort[]>([])
  const [domesticResorts, setDomesticResorts] = useState<Resort[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getPriceValue = (price: string): number => {
    const cleaned = price.replace(/[₹$,]/g, "").trim()
    const num = parseFloat(cleaned)
    return Number.isFinite(num) ? num : Number.POSITIVE_INFINITY
  }

  const sortByPriceAsc = (arr: Resort[]): Resort[] =>
    [...arr].sort((a, b) => getPriceValue(a.price) - getPriceValue(b.price))

  // Fetch resorts from MongoDB
  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setIsLoading(true)
        
        // Fetch international resorts
        const internationalResponse = await fetch('/api/resorts?type=international')
        const internationalData = await internationalResponse.json()
        
        if (internationalData.success) {
          setInternationalResorts(sortByPriceAsc(internationalData.data || []))
        }
        
        // Fetch domestic resorts
        const domesticResponse = await fetch('/api/resorts?type=domestic')
        const domesticData = await domesticResponse.json()

        if (domesticData.success) {
          setDomesticResorts(sortByPriceAsc(domesticData.data || []))
        }
      } catch (error) {
        console.error('Error fetching resorts:', error)
        setInternationalResorts([])
        setDomesticResorts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResorts()
  }, [])

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

  const ResortCard = ({
    resort,
    index,
  }: {
    resort: Resort
    index: number
  }) => (
    <div
      className={`group relative bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 h-full flex flex-col ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-56 overflow-hidden flex-shrink-0">
        <img
          src={resort.image || "/placeholder.svg"}
          alt={resort.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 z-10">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-white text-xs font-semibold">{resort.rating}</span>
        </div>
        <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full z-10">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-1 bg-card">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1.5 sm:mb-2">
          <MapPin className="w-3.5 h-3.5" />
          {resort.location}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-1">
          {resort.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {resort.amenities.slice(0, 4).map((amenity, idx) => (
            <span
              key={idx}
              className="text-xs bg-muted/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-muted-foreground border border-border/50"
            >
              {amenity}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border mt-auto">
          <div>
            <p className="text-xl font-bold text-primary">{resort.price}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Per night</p>
          </div>
          <Link href={`/resorts/${resort.id}`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-300 hover:scale-105"
            >
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <section ref={sectionRef} id="luxury-resorts" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-6 sm:mb-8 lg:mb-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
            Luxury Resorts with <span className="text-primary">Premium Experience</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Indulge in world-class accommodations and unforgettable luxury experiences
          </p>
        </div>

        <Tabs defaultValue="domestic" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-1 mb-6 sm:mb-8 lg:mb-8 bg-muted rounded-full">
          <TabsTrigger
              value="domestic"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-full transition-all duration-300"
            >
              <MapPin className="w-4 h-4" />
              Domestic
            </TabsTrigger>
            {/* <TabsTrigger
              value="international"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-full transition-all duration-300"
            >
              <Globe className="w-4 h-4" />
              International
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="international" className="mt-0">
            {isLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading international resorts...</p>
              </div>
            ) : internationalResorts.length > 0 ? (
              <Carousel
                setApi={setInternationalApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {internationalResorts.map((resort, index) => (
                    <CarouselItem key={resort.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                      <ResortCard resort={resort} index={index} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
                <CarouselNext className="hidden md:flex -right-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
              </Carousel>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No international resorts available.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="domestic" className="mt-0">
            {isLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading domestic resorts...</p>
              </div>
            ) : domesticResorts.length > 0 ? (
              <Carousel
                setApi={setDomesticApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {domesticResorts.map((resort, index) => (
                    <CarouselItem key={resort.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                      <ResortCard resort={resort} index={index} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
                <CarouselNext className="hidden md:flex -right-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
              </Carousel>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No domestic resorts available.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6 sm:mt-8 lg:mt-8">
          <Link href="/resorts">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent rounded-full px-8 transition-all duration-300 hover:scale-105"
            >
              View All Resorts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
