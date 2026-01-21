"use client"

import { useState, useEffect, useRef } from "react"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type TestimonialItem = {
  id?: string
  name: string
  location: string
  rating: number
  image: string
  text: string
  package: string
}

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [api, setApi] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [items, setItems] = useState<TestimonialItem[]>([])

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

  // Load testimonials from API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/testimonials")
        const json = await res.json()
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setItems(json.data)
        }
      } catch (error) {
        console.error("Error loading testimonials:", error)
      }
    }
    load()
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

  const TestimonialCard = ({ testimonial, index }: { testimonial: TestimonialItem; index: number }) => (
    <div
      className={`group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 p-4 sm:p-5 lg:p-6 h-full ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-accent fill-accent" />
          ))}
        </div>
        <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 lg:mb-5 italic flex-1">
          &ldquo;{testimonial.text}&rdquo;
        </p>
        <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 lg:pt-5 border-t border-border/50 mt-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-0.5 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              <img
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</h4>
            <p className="text-muted-foreground text-xs sm:text-sm">{testimonial.location}</p>
            <p className="text-primary text-xs font-medium mt-0.5 sm:mt-1 truncate">{testimonial.package}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section ref={sectionRef} id="testimonials" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-6 sm:mb-8 lg:mb-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
            What Our <span className="text-primary">Travelers Say</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Real experiences from adventurers who explored the world with us
          </p>
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
            {items.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <TestimonialCard testimonial={testimonial} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
          <CarouselNext className="hidden md:flex -right-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
        </Carousel>

      </div>
    </section>
  )
}
