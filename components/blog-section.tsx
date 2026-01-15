"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Hidden Gems for Hiking in the Swiss Alps",
    excerpt: "Discover the lesser-known trails that offer breathtaking views without the crowds...",
    image: "/swiss-alps-mountains-snow-travel.jpg",
    author: "Sarah Johnson",
    date: "Jan 8, 2026",
    readTime: "5 min read",
    category: "Hiking",
  },
  {
    id: 2,
    title: "Ultimate Guide to Camping in Ladakh",
    excerpt: "Everything you need to know about camping at high altitudes in the land of passes...",
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    author: "Raj Sharma",
    date: "Jan 6, 2026",
    readTime: "8 min read",
    category: "Camping",
  },
  {
    id: 3,
    title: "Best Time to Visit Norway for Northern Lights",
    excerpt: "Plan your trip to witness the magical aurora borealis dancing across the Arctic sky...",
    image: "/norway-fjords-beautiful-water-mountains.jpg",
    author: "Emma Wilson",
    date: "Jan 4, 2026",
    readTime: "6 min read",
    category: "Travel Tips",
  },
  {
    id: 4,
    title: "Exploring the Backwaters of Kerala",
    excerpt: "A serene journey through the peaceful canals and waterways of God's own country...",
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    author: "Priya Menon",
    date: "Jan 2, 2026",
    readTime: "7 min read",
    category: "Travel",
  },
]

export default function BlogSection() {
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
    <section ref={sectionRef} id="blog" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-8 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-2">
              Latest <span className="text-primary">Travel Stories</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">Insights, tips, and inspiration for your next adventure</p>
          </div>
          <Link href="/blog">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              View All Posts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
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
              {blogPosts.map((post, index) => (
                <CarouselItem key={post.id} className="pl-2 basis-full">
                  <article
                    className={`group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 ${
                      isVisible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 sm:gap-4 text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-border">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-white">{post.author}</span>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {blogPosts.map((post, index) => (
            <article
              key={post.id}
              className={`group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-5 lg:p-6">
                <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-white">{post.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
