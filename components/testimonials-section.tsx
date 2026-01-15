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

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    text: "My trip to the Swiss Alps was absolutely magical! Every detail was perfectly planned, and the guides were knowledgeable and friendly. I can't wait to book my next adventure with OffbeatTrips.",
    package: "Swiss Alps Explorer",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Mumbai, India",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    text: "The Ladakh adventure exceeded all my expectations. The landscapes were breathtaking, and the cultural experiences were authentic. Highly recommend for anyone seeking a true adventure!",
    package: "Ladakh Adventure",
  },
  {
    id: 3,
    name: "Emily Chen",
    location: "Sydney, Australia",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    text: "The Maldives resort was paradise on earth. The luxury accommodations, crystal-clear waters, and impeccable service made it an unforgettable experience. Worth every penny!",
    package: "Maldives Paradise Resort",
  },
  {
    id: 4,
    name: "Michael Thompson",
    location: "London, UK",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    text: "Norway fjords tour was spectacular! The Northern Lights experience was the highlight of my trip. The team at OffbeatTrips knows how to create memorable journeys.",
    package: "Norwegian Fjords",
  },
  {
    id: 5,
    name: "Priya Sharma",
    location: "Delhi, India",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    text: "Kerala backwaters was so peaceful and rejuvenating. The houseboat stay and Ayurveda spa treatments were exactly what I needed. A perfect blend of relaxation and culture.",
    package: "Kerala Backwaters",
  },
  {
    id: 6,
    name: "David Martinez",
    location: "Barcelona, Spain",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    text: "Thailand trip was amazing! From island hopping to delicious cuisine, everything was perfect. The local guides were fantastic and made us feel like family.",
    package: "Thailand Paradise",
  },
]

export default function TestimonialsSection() {
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

  const TestimonialCard = ({ testimonial, index }: { testimonial: (typeof testimonials)[0]; index: number }) => (
    <div
      className={`group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 p-4 sm:p-5 lg:p-6 h-full ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-accent fill-accent" />
          ))}
        </div>
        <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 lg:mb-5 italic">
          &ldquo;{testimonial.text}&rdquo;
        </p>
        <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 lg:pt-5 border-t border-border/50">
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
            {testimonials.map((testimonial, index) => (
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
