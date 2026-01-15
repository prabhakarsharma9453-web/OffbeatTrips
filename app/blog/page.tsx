"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { Calendar, User, ArrowRight, Clock, Plus, Image as ImageIcon, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const initialBlogPosts = [
  {
    id: 1,
    title: "Top 10 Hidden Gems for Hiking in the Swiss Alps",
    excerpt: "Discover the lesser-known trails that offer breathtaking views without the crowds...",
    image: "/swiss-alps-mountains-snow-travel.jpg",
    author: "Sarah Johnson",
    date: "Jan 8, 2026",
    readTime: "5 min read",
    category: "Hiking",
    fullContent: "Discover the lesser-known trails that offer breathtaking views without the crowds. These hidden gems provide an authentic Alpine experience away from the tourist hotspots.",
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
    fullContent: "Everything you need to know about camping at high altitudes in the land of passes. Learn about the best campsites, weather conditions, and essential gear for your Ladakh adventure.",
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
    fullContent: "Plan your trip to witness the magical aurora borealis dancing across the Arctic sky. This comprehensive guide covers the best months, locations, and tips for photographing this natural wonder.",
  },
  {
    id: 4,
    title: "Thailand Beach Paradise: Island Hopping Guide",
    excerpt: "Explore the pristine beaches and crystal-clear waters of Thailand's most beautiful islands...",
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    author: "Mike Chen",
    date: "Jan 2, 2026",
    readTime: "7 min read",
    category: "Beach",
    fullContent: "Explore the pristine beaches and crystal-clear waters of Thailand's most beautiful islands. From Phuket to Koh Samui, discover the best spots for snorkeling, relaxation, and adventure.",
  },
  {
    id: 5,
    title: "Adventure Photography: Capturing the Perfect Shot",
    excerpt: "Tips and techniques for taking stunning travel and adventure photographs...",
    image: "/beautiful-waterfall-nature-hiking.jpg",
    author: "Alex Rivera",
    date: "Dec 30, 2025",
    readTime: "10 min read",
    category: "Photography",
    fullContent: "Tips and techniques for taking stunning travel and adventure photographs. Learn about composition, lighting, and equipment to capture unforgettable moments on your journeys.",
  },
  {
    id: 6,
    title: "Kerala Backwaters: A Serene Houseboat Experience",
    excerpt: "Experience the tranquility of Kerala's famous backwaters aboard a traditional houseboat...",
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    author: "Priya Patel",
    date: "Dec 28, 2025",
    readTime: "5 min read",
    category: "Cultural",
    fullContent: "Experience the tranquility of Kerala's famous backwaters aboard a traditional houseboat. Learn about the local culture, cuisine, and the best routes for your houseboat journey.",
  },
]

export default function BlogPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [showStoryForm, setShowStoryForm] = useState(false)
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  const [storyForm, setStoryForm] = useState({
    title: "",
    author: "",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setStoryForm({ ...storyForm, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault()
    const newPost = {
      id: blogPosts.length + 1,
      title: storyForm.title,
      author: storyForm.author || "Anonymous",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: `${Math.ceil(storyForm.content.split(" ").length / 200)} min read`,
      category: storyForm.category || "Travel",
      excerpt: storyForm.excerpt || storyForm.content.substring(0, 100) + "...",
      image: imagePreview || "/placeholder.svg",
      fullContent: storyForm.content,
    }
    setBlogPosts([newPost, ...blogPosts])
    setStoryForm({ title: "", author: "", category: "", excerpt: "", content: "", image: "" })
    setImagePreview(null)
    setShowStoryForm(false)
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
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Author Name</label>
                    <Input
                      value={storyForm.author}
                      onChange={(e) => setStoryForm({ ...storyForm, author: e.target.value })}
                      placeholder="Your name (optional)"
                      className="bg-background/50 border-border"
                    />
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
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Choose Image</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
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

                <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-full px-8">
                  <Send className="w-4 h-4 mr-2" />
                  Publish Story
                </Button>
              </form>
            </div>
          )}

          {/* Blog Posts Grid */}
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
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80 group-hover:translate-x-1 transition-transform"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
