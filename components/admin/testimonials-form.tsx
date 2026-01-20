"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Loader2, Save, X, Upload } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  image: string
  text: string
  packageName: string
}

export default function TestimonialsForm() {
  const { toast } = useToast()
  const [items, setItems] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: 5,
    image: "",
    text: "",
    packageName: "",
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/testimonials")
      const json = await res.json()
      if (json.success) {
        setItems(json.data)
      } else {
        toast({
          title: "Error",
          description: json.error || "Failed to load testimonials",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading testimonials:", error)
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      rating: 5,
      image: "",
      text: "",
      packageName: "",
    })
    setEditing(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: Testimonial) => {
    setEditing(item)
    setFormData({
      name: item.name,
      location: item.location || "",
      rating: item.rating,
      image: item.image || "",
      text: item.text,
      packageName: item.packageName || "",
    })
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    if (isSaving) return
    setIsDialogOpen(false)
    resetForm()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image must be under 5MB.", variant: "destructive" })
      return
    }

    try {
      setIsUploading(true)
      const form = new FormData()
      form.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      })
      const json = await res.json()
      if (!json.success || !json.path) {
        throw new Error(json.error || "Upload failed")
      }

      setFormData((prev) => ({ ...prev, image: json.path }))
      toast({ title: "Image uploaded", description: "Image uploaded successfully." })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "Could not upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.text.trim()) {
      toast({
        title: "Missing fields",
        description: "Name and review text are required.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const method = editing ? "PUT" : "POST"
      const body = editing ? { id: editing.id, ...formData } : formData

      const res = await fetch("/api/admin/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.error || "Failed to save testimonial")
      }

      toast({
        title: editing ? "Updated" : "Created",
        description: editing ? "Testimonial updated successfully." : "Testimonial created successfully.",
      })

      setIsDialogOpen(false)
      resetForm()
      fetchItems()
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save testimonial",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const confirmDelete = (id: string) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/admin/testimonials?id=${deletingId}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.error || "Failed to delete testimonial")
      }
      toast({ title: "Deleted", description: "Testimonial deleted successfully." })
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      fetchItems()
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete testimonial",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-white">Customer Reviews</h2>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Review
        </Button>
      </div>

      {/* List */}
      <div className="grid gap-4 md:gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm text-muted-foreground font-semibold">
                    {item.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-white font-semibold text-sm md:text-base truncate">{item.name}</p>
                  {item.location && (
                    <p className="text-xs md:text-sm text-muted-foreground truncate">• {item.location}</p>
                  )}
                </div>
                {item.packageName && (
                  <p className="text-xs text-primary font-medium">Package: {item.packageName}</p>
                )}
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{item.text}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:flex-col md:items-end">
              <p className="text-sm text-yellow-400 font-semibold">{item.rating.toFixed(1)}★</p>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => openEditDialog(item)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="text-destructive" onClick={() => confirmDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
            No reviews yet. Add your first customer review.
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Review" : "Add Review"}</DialogTitle>
            <DialogDescription>
              Add a customer testimonial that will appear in the “What Our Travelers Say” section on the homepage.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Customer Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                  placeholder="Mumbai, India"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Package / Trip Name</label>
              <Input
                value={formData.packageName}
                onChange={(e) => setFormData((p) => ({ ...p, packageName: e.target.value }))}
                placeholder="Ladakh Adventure"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Rating</label>
              <Select
                value={String(formData.rating)}
                onValueChange={(v) => setFormData((p) => ({ ...p, rating: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4.5, 4, 3.5, 3].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {r}★
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Review Text *</label>
              <Textarea
                value={formData.text}
                onChange={(e) => setFormData((p) => ({ ...p, text: e.target.value }))}
                rows={4}
                placeholder="Share what made this journey special for the traveler..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Customer Image</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {formData.image ? (
                    <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-primary cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                  {formData.image && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData((p) => ({ ...p, image: "" }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="gap-2" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editing ? "Update Review" : "Save Review"}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

