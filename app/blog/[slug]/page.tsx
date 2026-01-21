"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type StoryDetail = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  images?: string[]
  category: string
  readTimeMinutes: number
  authorName: string
  authorImage?: string
  createdAt: string
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

export default function StoryDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [isLoading, setIsLoading] = useState(true)
  const [story, setStory] = useState<StoryDetail | null>(null)
  const [error, setError] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const userInteractedRef = useRef(false)

  // Get all images - prioritize images array, fallback to single image
  const galleryImages = useMemo(() => {
    if (!story) return []
    return story.images && story.images.length > 0 
      ? story.images 
      : story.image 
        ? [story.image] 
        : []
  }, [story])

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || galleryImages.length <= 1 || userInteractedRef.current) return

    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [autoPlay, galleryImages.length])

  const handleUserInteraction = () => {
    userInteractedRef.current = true
    setAutoPlay(false)
  }

  const handleThumbnailClick = (index: number) => {
    handleUserInteraction()
    setSelectedImageIndex(index)
  }

  const handlePrevious = () => {
    handleUserInteraction()
    setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const handleNext = () => {
    handleUserInteraction()
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        setError("")
        const res = await fetch(`/api/stories/${encodeURIComponent(slug)}`)
        const json = await res.json()
        if (res.ok && json?.success) {
          setStory(json.data)
        } else {
          setStory(null)
          setError(json?.error || `Failed to load story (${res.status})`)
        }
      } catch {
        setStory(null)
        setError("Failed to load story")
      } finally {
        setIsLoading(false)
      }
    }
    if (slug) load()
  }, [slug])

  const paragraphs = useMemo(() => {
    const text = story?.content || ""
    return text.split("\n").map((p) => p.trim()).filter(Boolean)
  }, [story?.content])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/blog">
              <Button variant="ghost" className="text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Stories
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <p className="text-destructive font-medium">{error}</p>
              <p className="text-muted-foreground mt-2">Please go back and try another story.</p>
            </div>
          ) : !story ? null : (
            <article className="bg-card border border-border rounded-3xl overflow-hidden">
              {/* Image Carousel */}
              <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                {galleryImages.length > 0 ? (
                  <>
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          idx === selectedImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`${story.title} - Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    ))}
                    
                    {/* Navigation buttons */}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevious}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6 text-white" />
                        </button>

                        {/* Image counter */}
                        <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                          <span className="text-xs text-white font-medium">
                            {selectedImageIndex + 1} / {galleryImages.length}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent z-10" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-primary text-white border-primary/20">{story.category || "Travel"}</Badge>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">{story.title}</h1>
                  {story.excerpt ? <p className="text-muted-foreground">{story.excerpt}</p> : null}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {galleryImages.length > 1 && (
                <div className="relative bg-background/95 backdrop-blur-sm border-t border-border p-4">
                  <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth hide-scrollbar">
                    {galleryImages.map((src, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`relative shrink-0 w-24 h-20 sm:w-28 sm:h-24 md:w-32 md:h-28 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                          selectedImageIndex === index
                            ? 'border-primary scale-105 shadow-lg shadow-primary/30 opacity-100'
                            : 'border-border/50 hover:border-border/80 opacity-70 hover:opacity-100'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img
                          src={src || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                          }}
                        />
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-primary/20 ring-2 ring-primary/50" />
                        )}
                      </button>
                    ))}
                  </div>
                  {autoPlay && galleryImages.length > 1 && (
                    <div className="absolute top-2 right-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span>Auto-scrolling</span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(story.createdAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {story.readTimeMinutes} min read
                  </span>
                  <span className="flex items-center gap-2">
                    <Avatar className="size-7 border border-border/60">
                      <AvatarImage src={story.authorImage || ""} alt={story.authorName} />
                      <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-semibold">
                        {initials(story.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{story.authorName}</span>
                  </span>
                </div>

                <div className="space-y-5">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, idx) => (
                      <p key={idx} className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {p}
                      </p>
                    ))
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-line">{story.content}</p>
                  )}
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

