"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2, Save, Upload, X, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface StoryItem {
  id: string
  title: string
  category: string
  excerpt: string
  content: string
  image: string
  images?: string[]
  authorName?: string
  createdAt: string
}

export default function StoriesForm() {
  const { toast } = useToast()
  const [stories, setStories] = useState<StoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<StoryItem | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [imagesList, setImagesList] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: "",
    authorName: "",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast({ title: "Invalid file", description: `${file.name} is not an image file.`, variant: "destructive" })
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 5MB limit.`, variant: "destructive" })
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    try {
      setIsUploading(true)
      const uploadPromises = validFiles.map(async (file) => {
        const form = new FormData()
        form.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: form })
        const json = await res.json()
        if (!json.success || !json.path) {
          throw new Error(json.error || "Upload failed")
        }
        return json.path
      })

      const uploadedPaths = await Promise.all(uploadPromises)
      const newImagesList = [...imagesList, ...uploadedPaths]
      setImagesList(newImagesList)
      if (!imagePreview && uploadedPaths[0]) {
        setImagePreview(uploadedPaths[0])
        setFormData((prev) => ({ ...prev, image: uploadedPaths[0] }))
      }
      toast({ title: "Images uploaded", description: `${uploadedPaths.length} image(s) uploaded successfully.` })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "Could not upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (e.target) {
        e.target.value = ""
      }
    }
  }

  const handleAddImageUrl = () => {
    const url = formData.image.trim()
    if (!url) {
      toast({ title: "No URL", description: "Please enter an image URL first.", variant: "destructive" })
      return
    }
    if (imagesList.includes(url)) {
      toast({ title: "Duplicate", description: "This image URL is already in the list.", variant: "destructive" })
      return
    }
    const newImagesList = [url, ...imagesList.filter((img) => img !== url)]
    setImagesList(newImagesList)
    if (!imagePreview) {
      setImagePreview(url)
    }
    setFormData((prev) => ({ ...prev, image: "" }))
    toast({ title: "Image added", description: "Image URL added to gallery." })
  }

  const handleRemoveImage = (index: number) => {
    const newImagesList = imagesList.filter((_, i) => i !== index)
    setImagesList(newImagesList)
    if (index === 0 && newImagesList.length > 0) {
      setImagePreview(newImagesList[0])
      setFormData((prev) => ({ ...prev, image: newImagesList[0] }))
    } else if (newImagesList.length === 0) {
      setImagePreview(null)
      setFormData((prev) => ({ ...prev, image: "" }))
    }
  }

  const handleSetMainImage = (index: number) => {
    if (index === 0) return
    const newImagesList = [imagesList[index], ...imagesList.filter((_, i) => i !== index)]
    setImagesList(newImagesList)
    setImagePreview(newImagesList[0])
    setFormData((prev) => ({ ...prev, image: newImagesList[0] }))
  }

  const handleOpenEditDialog = (story: StoryItem) => {
    setEditingStory(story)
    setFormData({
      title: story.title || "",
      category: story.category || "",
      excerpt: story.excerpt || "",
      content: story.content || "",
      image: "",
      authorName: story.authorName || "",
    })
    setImagesList(story.images || (story.image ? [story.image] : []))
    setImagePreview(story.image || null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingStory(null)
    setFormData({ title: "", category: "", excerpt: "", content: "", image: "", authorName: "" })
    setImagesList([])
    setImagePreview(null)
  }

  const handleDeleteStory = async () => {
    if (!deletingId) return

    try {
      setIsSaving(true)
      const res = await fetch(`/api/user/stories/${deletingId}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.error || "Failed to delete story")
      }

      toast({ title: "Story deleted", description: "Story has been deleted successfully." })
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      loadStories()
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete story",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Use imagesList, fallback to formData.image or imagePreview
    const allImages = imagesList.length > 0 
      ? imagesList 
      : formData.image.trim() 
        ? [formData.image.trim()] 
        : imagePreview 
          ? [imagePreview] 
          : []
    const mainImage = allImages[0] || ""

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing fields",
        description: "Title and content are required.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      const isEdit = editingStory !== null
      const url = isEdit ? `/api/user/stories/${editingStory.id}` : "/api/user/stories"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: mainImage,
          images: allImages,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.error || `Failed to ${isEdit ? "update" : "publish"} story`)
      }

      toast({ 
        title: isEdit ? "Story updated" : "Story published", 
        description: `Story has been ${isEdit ? "updated" : "published"} successfully.` 
      })
      setFormData({ title: "", category: "", excerpt: "", content: "", image: "", authorName: "" })
      setImagesList([])
      setImagePreview(null)
      if (isEdit) {
        handleCloseDialog()
      } else {
        setShowForm(false)
      }
      loadStories()
    } catch (error) {
      console.error("Story save error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${editingStory ? "update" : "publish"} story`,
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
          onClick={() => {
            if (showForm) {
              setShowForm(false)
              setFormData({ title: "", category: "", excerpt: "", content: "", image: "", authorName: "" })
              setImagesList([])
              setImagePreview(null)
            } else {
              setShowForm(true)
              setEditingStory(null)
            }
          }}
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
            <label className="text-xs font-medium text-muted-foreground">Author Name</label>
            <Input
              value={formData.authorName}
              onChange={(e) => setFormData((p) => ({ ...p, authorName: e.target.value }))}
              placeholder="Admin User"
            />
            <p className="text-xs text-muted-foreground">Leave empty to use your account name</p>
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
            <label className="text-xs font-medium text-muted-foreground">Story Images</label>
            <div className="space-y-3">
              {/* Image Upload Controls */}
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Upload Images</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <div className="text-xs text-muted-foreground">OR</div>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddImageUrl}
                  disabled={!formData.image.trim()}
                >
                  Add URL
                </Button>
              </div>

              {/* Main Image Preview */}
              {imagePreview && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Main Image Preview</p>
                  <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        setImagePreview(null)
                        toast({
                          title: "Invalid image",
                          description: "Could not load image. Please try again.",
                          variant: "destructive",
                        })
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Scrollable Image Gallery */}
              {imagesList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {imagesList.length} image(s) - First image is the main/cover image
                  </p>
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 pb-2" style={{ minWidth: "max-content" }}>
                      {imagesList.map((img, index) => (
                        <div
                          key={`${img}-${index}`}
                          className="relative flex-shrink-0 w-32 h-24 border-2 rounded-lg overflow-hidden bg-background group"
                          style={{
                            borderColor: index === 0 ? "var(--primary)" : "var(--border)",
                          }}
                        >
                          <img
                            src={img}
                            alt={`Story image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                            }}
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
                              Main
                            </div>
                          )}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(index)}
                              className="absolute top-1 left-1 bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full hover:bg-secondary/80 transition-colors"
                            >
                              Set Main
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove image ${index + 1}`}
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                  {editingStory ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editingStory ? "Update Story" : "Publish Story"}
                </>
              )}
            </Button>
            {editingStory && (
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
            )}
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
          <ul className="space-y-3">
            {stories.map((s) => (
              <li key={s.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-card/50 border border-border rounded-lg">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {s.category || "Travel"} • {s.authorName || "Anonymous"} • {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditDialog(s)}
                    className="hover:bg-primary hover:text-primary-foreground"
                    title="Edit Story"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeletingId(s.id)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    title="Delete Story"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Story</DialogTitle>
            <DialogDescription>Update story information and content</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="text-xs font-medium text-muted-foreground">Author Name</label>
              <Input
                value={formData.authorName}
                onChange={(e) => setFormData((p) => ({ ...p, authorName: e.target.value }))}
                placeholder="Admin User"
              />
              <p className="text-xs text-muted-foreground">Leave empty to use your account name</p>
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
              <label className="text-xs font-medium text-muted-foreground">Story Images</label>
              <div className="space-y-3">
                {/* Image Upload Controls */}
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Upload Images</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  <div className="text-xs text-muted-foreground">OR</div>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                    placeholder="Enter image URL"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImageUrl}
                    disabled={!formData.image.trim()}
                  >
                    Add URL
                  </Button>
                </div>

                {/* Main Image Preview */}
                {imagePreview && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Main Image Preview</p>
                    <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => {
                          setImagePreview(null)
                          toast({
                            title: "Invalid image",
                            description: "Could not load image. Please try again.",
                            variant: "destructive",
                          })
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Scrollable Image Gallery */}
                {imagesList.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {imagesList.length} image(s) - First image is the main/cover image
                    </p>
                    <div className="overflow-x-auto scrollbar-hide">
                      <div className="flex gap-3 pb-2" style={{ minWidth: "max-content" }}>
                        {imagesList.map((img, index) => (
                          <div
                            key={`${img}-${index}`}
                            className="relative flex-shrink-0 w-32 h-24 border-2 rounded-lg overflow-hidden bg-background group"
                            style={{
                              borderColor: index === 0 ? "var(--primary)" : "var(--border)",
                            }}
                          >
                            <img
                              src={img}
                              alt={`Story image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                            {index === 0 && (
                              <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
                                Main
                              </div>
                            )}
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetMainImage(index)}
                                className="absolute top-1 left-1 bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full hover:bg-secondary/80 transition-colors"
                              >
                                Set Main
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label={`Remove image ${index + 1}`}
                              title="Remove image"
                            >
                              <X className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Story Content *</label>
              <Textarea
                rows={8}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Story
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this story? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

