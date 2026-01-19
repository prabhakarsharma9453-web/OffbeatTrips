"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Calendar, User, ArrowRight, Clock, Plus, Image as ImageIcon, X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type StoryItem = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
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

export default function BlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isVisible, setIsVisible] = useState(false)
  const [showStoryForm, setShowStoryForm] = useState(false)
  const [blogPosts, setBlogPosts] = useState<StoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [storyForm, setStoryForm] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/stories?limit=50")
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setBlogPosts(json.data)
        } else {
          setBlogPosts([])
        }
      } catch {
        setBlogPosts([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid File", description: "Please select an image file", variant: "destructive" })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Image must be less than 5MB", variant: "destructive" })
      return
    }

    if (status !== "authenticated") {
      toast({ title: "Login required", description: "Please login to upload story images.", variant: "destructive" })
      router.push("/login")
      return
    }

    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/user/upload-story", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || `Upload failed (${res.status})`)
      }
      setImagePreview(json.path)
      setStoryForm((prev) => ({ ...prev, image: json.path }))
      toast({ title: "Success", description: "Image uploaded successfully" })
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: err instanceof Error ? err.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== "authenticated") {
      toast({ title: "Login required", description: "Please login to publish your story.", variant: "destructive" })
      router.push("/login")
      return
    }

    if (!storyForm.title.trim()) {
      toast({ title: "Validation Error", description: "Story Title is required", variant: "destructive" })
      return
    }
    if (!storyForm.content.trim()) {
      toast({ title: "Validation Error", description: "Full Story is required", variant: "destructive" })
      return
    }
    if (!(storyForm.image || imagePreview)?.trim()) {
      toast({ title: "Validation Error", description: "Image is required", variant: "destructive" })
      return
    }

    setIsPublishing(true)
    try {
      const payload = {
        title: storyForm.title.trim(),
        category: storyForm.category.trim() || "Travel",
        excerpt: storyForm.excerpt.trim() || undefined,
        content: storyForm.content.trim(),
        image: (storyForm.image || imagePreview || "").trim(),
      }

      const res = await fetch("/api/user/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || `Failed to publish (${res.status})`)
      }

      toast({ title: "Published", description: "Your story is now live." })
      setStoryForm({ title: "", category: "", excerpt: "", content: "", image: "" })
      setImagePreview(null)
      setShowStoryForm(false)

      // refresh list
      const listRes = await fetch("/api/stories?limit=50")
      const listJson = await listRes.json()
      setBlogPosts(listJson.success ? (listJson.data || []) : [])
    } catch (err) {
      toast({
        title: "Publish Failed",
        description: err instanceof Error ? err.message : "Failed to publish story",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section ref={sectionRef} className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Travel <span className="text-primary">Stories</span> & Blog
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
              Read inspiring travel stories, tips, and share your own adventures with our community
            </p>
            <Button
              onClick={() => setShowStoryForm(!showStoryForm)}
              className="bg-primary hover:bg-primary/90 rounded-full px-8"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showStoryForm ? "Cancel" : "Share Your Story"}
            </Button>
          </div>

          {/* Story Submission Form */}
          {showStoryForm && (
            <div className="mb-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Share Your Travel Story</h2>
              <form onSubmit={handleSubmitStory} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Story Title *</label>
                    <Input
                      required
                      value={storyForm.title}
                      onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                      placeholder="Enter your story title"
                      className="bg-background/50 border-border"
                    />
                  </div>
                  <div className="flex items-end">
                    <p className="text-sm text-muted-foreground">
                      Publishing as:{" "}
                      <span className="text-white font-semibold">
                        {status === "authenticated" ? (session?.user?.name || session?.user?.email) : "Guest"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Category</label>
                    <Input
                      value={storyForm.category}
                      onChange={(e) => setStoryForm({ ...storyForm, category: e.target.value })}
                      placeholder="e.g., Adventure, Beach, Cultural"
                      className="bg-background/50 border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Image URL</label>
                    <Input
                      value={storyForm.image}
                      onChange={(e) => setStoryForm({ ...storyForm, image: e.target.value })}
                      placeholder="Enter image URL or upload below"
                      className="bg-background/50 border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Upload Image</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {isUploading ? "Uploading..." : "Choose Image"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        aria-label="Upload story image"
                        title="Upload story image"
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null)
                            setStoryForm({ ...storyForm, image: "" })
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                          aria-label="Remove image"
                          title="Remove image"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Short Excerpt</label>
                  <Input
                    value={storyForm.excerpt}
                    onChange={(e) => setStoryForm({ ...storyForm, excerpt: e.target.value })}
                    placeholder="Brief description of your story"
                    className="bg-background/50 border-border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Story *</label>
                  <Textarea
                    required
                    value={storyForm.content}
                    onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                    placeholder="Write your travel story here..."
                    rows={10}
                    className="bg-background/50 border-border resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 rounded-full px-8"
                  disabled={isPublishing || isUploading}
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publish Story
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className={`group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
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
                <div className="p-6">
                  <div className="flex items-center gap-4 text-muted-foreground text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTimeMinutes} min read
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Avatar className="size-7 border border-border/60">
                        <AvatarImage src={post.authorImage || ""} alt={post.authorName} />
                        <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-semibold">
                          {initials(post.authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.authorName}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 group-hover:translate-x-1 transition-transform"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground">No stories yet. Click “Share Your Story” to publish the first one.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
