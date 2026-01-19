"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Calendar, User, ArrowRight, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

type StoryCard = {
  id: string
  title: string
  slug: string
  excerpt: string
  image: string
  authorName: string
  authorImage?: string
  createdAt: string
  readTimeMinutes: number
  category: string
}

function formatDate(input: string) {
  try {
    return new Date(input).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return input
  }
}

function initials(name: string) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  const first = parts[0]?.[0] || "U"
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : ""
  return (first + second).toUpperCase()
}

export default function BlogSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [api, setApi] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [posts, setPosts] = useState<StoryCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/stories?limit=4")
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setPosts(
            json.data.map((s: any) => ({
              id: s.id,
              title: s.title,
              slug: s.slug,
              excerpt: s.excerpt,
              image: s.image,
              authorName: s.authorName || "Anonymous",
              authorImage: s.authorImage || "",
              createdAt: s.createdAt,
              readTimeMinutes: s.readTimeMinutes ?? 5,
              category: s.category || "Travel",
            }))
          )
        } else {
          setPosts([])
        }
      } catch {
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

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

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">No stories yet. Be the first to share your travel story!</p>
            <div className="mt-4">
              <Link href="/blog">
                <Button className="bg-primary hover:bg-primary/90 rounded-full px-6">Share Your Story</Button>
              </Link>
            </div>
          </div>
        ) : null}

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
              {posts.map((post, index) => (
                <CarouselItem key={post.id} className="pl-2 basis-full">
                  <Link href={`/blog/${post.slug}`} className="block">
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
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                          }}
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
                            {formatDate(post.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTimeMinutes} min read
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-border">
                          <Avatar className="size-8 border border-border/60">
                            <AvatarImage src={post.authorImage || ""} alt={post.authorName} />
                            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                              {initials(post.authorName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-white">{post.authorName}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {posts.map((post, index) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block">
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
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
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
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTimeMinutes} min read
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <Avatar className="size-8 border border-border/60">
                      <AvatarImage src={post.authorImage || ""} alt={post.authorName} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                        {initials(post.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-white">{post.authorName}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
