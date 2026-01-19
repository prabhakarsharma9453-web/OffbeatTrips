"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type StoryDetail = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
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
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img
                  src={story.image || "/placeholder.svg"}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-primary text-white border-primary/20">{story.category || "Travel"}</Badge>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">{story.title}</h1>
                  {story.excerpt ? <p className="text-muted-foreground">{story.excerpt}</p> : null}
                </div>
              </div>

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

