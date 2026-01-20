"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface StoryItem {
  id: string
  title: string
  category: string
  excerpt: string
  image: string
  createdAt: string
}

export default function StoriesForm() {
  const { toast } = useToast()
  const [stories, setStories] = useState<StoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: "",
  })

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/user/stories")
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setStories(json.data)
      } else {
        setStories([])
      }
    } catch (error) {
      console.error("Error loading stories:", error)
      setStories([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim() || !formData.image.trim()) {
      toast({
        title: "Missing fields",
        description: "Title, content and image are required.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      const res = await fetch("/api/user/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.error || "Failed to publish story")
      }

      toast({ title: "Story published", description: "Your travel story is now live." })
      setFormData({ title: "", category: "", excerpt: "", content: "", image: "" })
      setShowForm(false)
      loadStories()
    } catch (error) {
      console.error("Story publish error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish story",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-white">Latest Travel Stories</h2>
        <Button
          variant={showForm ? "outline" : "default"}
          onClick={() => setShowForm((v) => !v)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Close form" : "Add Story"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-card/70 border border-border rounded-xl p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="A Monsoon Escape to the Western Ghats"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                placeholder="Adventure, Honeymoon, Family..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Short Excerpt</label>
            <Textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
              placeholder="One or two lines that summarise this story..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Cover Image URL *</label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
              placeholder="/uploads/your-image.jpg"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Story Content *</label>
            <Textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
              placeholder="Write the full story that will appear on the blog page..."
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Publish Story
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Simple list of recent stories for reference */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Recent stories</p>
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : stories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No stories yet. Publish your first travel story above.</p>
        ) : (
          <ul className="space-y-2">
            {stories.slice(0, 6).map((s) => (
              <li key={s.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {s.category || "Travel"} • {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs text-primary">Live on blog</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

