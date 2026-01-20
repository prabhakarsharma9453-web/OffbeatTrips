"use client"

import { useEffect, useMemo, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type ActivitySlug =
  | "hiking"
  | "camping"
  | "water-sports"
  | "paragliding"
  | "skiing"
  | "cycling"
  | "cruises"
  | "photography-tours"

const ACTIVITY_OPTIONS: Array<{ value: ActivitySlug; label: string }> = [
  { value: "hiking", label: "Hiking" },
  { value: "camping", label: "Camping" },
  { value: "water-sports", label: "Water Sports" },
  { value: "paragliding", label: "Paragliding" },
  { value: "skiing", label: "Skiing" },
  { value: "cycling", label: "Cycling" },
  { value: "cruises", label: "Cruises" },
  { value: "photography-tours", label: "Photography Tours" },
]

interface Trip {
  ID: string
  slug: string
  title: string
  activity: ActivitySlug
  location: string
  country: string
  duration: string
  price: string
  rating: number
  reviewCount: number
  image: string
  images: string[]
  description: string
  highlights: string[]
  difficulty: string
  groupSize: string
  type: "domestic" | "international"
  order: string | null
}

function parseJsonOrComma(value: string): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean)
  } catch {
    // ignore
  }
  return value.split(",").map((v) => v.trim()).filter(Boolean)
}

export default function TripForm() {
  const { toast } = useToast()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagesList, setImagesList] = useState<string[]>([])

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    activity: "hiking" as ActivitySlug,
    location: "",
    country: "",
    duration: "",
    price: "",
    rating: 4.5,
    reviewCount: 0,
    image: "",
    description: "",
    highlights: "",
    difficulty: "",
    groupSize: "",
    type: "domestic" as "domestic" | "international",
    order: "",
  })

  const isEditMode = Boolean(editingTrip)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/trips")
      const result = await response.json()

      if (result.success) {
        setTrips(result.data || [])
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch trips",
          variant: "destructive",
        })
        setTrips([])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch trips",
        variant: "destructive",
      })
      setTrips([])
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEditingTrip(null)
    setFormData({
      slug: "",
      title: "",
      activity: "hiking",
      location: "",
      country: "",
      duration: "",
      price: "",
      rating: 4.5,
      reviewCount: 0,
      image: "",
      description: "",
      highlights: "",
      difficulty: "",
      groupSize: "",
      type: "domestic",
      order: "",
    })
    setImagePreview(null)
    setImagesList([])
  }

  const handleOpenDialog = (trip?: Trip) => {
    if (trip) {
      setEditingTrip(trip)
      const imgs = Array.isArray(trip.images) && trip.images.length > 0 ? trip.images : (trip.image ? [trip.image] : [])
      setImagesList(imgs)
      setImagePreview(imgs[0] || null)
      setFormData({
        slug: trip.slug || "",
        title: trip.title || "",
        activity: trip.activity || "hiking",
        location: trip.location || "",
        country: trip.country || "",
        duration: trip.duration || "",
        price: trip.price || "",
        rating: trip.rating || 4.5,
        reviewCount: trip.reviewCount || 0,
        image: imgs[0] || trip.image || "",
        description: trip.description || "",
        highlights: Array.isArray(trip.highlights) ? JSON.stringify(trip.highlights) : "",
        difficulty: trip.difficulty || "",
        groupSize: trip.groupSize || "",
        type: trip.type || "domestic",
        order: trip.order || "",
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const handleRemoveImage = (index: number) => {
    const newImages = imagesList.filter((_, i) => i !== index)
    setImagesList(newImages)
    if (newImages.length > 0) {
      setImagePreview(newImages[0])
      setFormData((prev) => ({ ...prev, image: newImages[0] }))
    } else {
      setImagePreview(null)
      setFormData((prev) => ({ ...prev, image: "" }))
    }
  }

  const handleSetMainImage = (index: number) => {
    const selected = imagesList[index]
    if (!selected) return
    const newImages = [selected, ...imagesList.filter((_, i) => i !== index)]
    setImagesList(newImages)
    setImagePreview(selected)
    setFormData((prev) => ({ ...prev, image: selected }))
  }

  const handleAddImageUrl = () => {
    const url = prompt("Enter image URL:")
    if (!url || !url.trim()) return
    const trimmed = url.trim()
    const newImages = [trimmed, ...imagesList.filter((img) => img !== trimmed)]
    setImagesList(newImages)
    setImagePreview(trimmed)
    setFormData((prev) => ({ ...prev, image: trimmed }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const validFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        })
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        })
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    setIsUploading(true)
    try {
      const uploadPromises = validFiles.map(async (file) => {
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: fd })
        const json = await res.json()
        if (!json.success) throw new Error(json.error || "Upload failed")
        return json.path as string
      })

      const uploadedPaths = await Promise.all(uploadPromises)
      const existing = imagesList.filter((img) => img && img.trim())
      const merged = [...existing, ...uploadedPaths.filter((p) => !existing.includes(p))]
      setImagesList(merged)

      if (merged.length > 0 && (!imagePreview || !formData.image)) {
        setImagePreview(merged[0])
        setFormData((prev) => ({ ...prev, image: merged[0] }))
      }

      toast({
        title: "Success",
        description: `${uploadedPaths.length} image(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Build images array
      let allImages: string[] = []
      if (imagesList.length > 0) allImages = imagesList.filter((img) => img && img.trim())
      if (formData.image && formData.image.trim()) {
        const main = formData.image.trim()
        allImages = [main, ...allImages.filter((i) => i !== main)]
      }
      allImages = Array.from(new Set(allImages.filter(Boolean)))

      if (!formData.title.trim()) {
        toast({ title: "Validation Error", description: "Title is required", variant: "destructive" })
        setIsSaving(false)
        return
      }
      if (!formData.location.trim()) {
        toast({ title: "Validation Error", description: "Location is required", variant: "destructive" })
        setIsSaving(false)
        return
      }
      if (!formData.duration.trim()) {
        toast({ title: "Validation Error", description: "Duration is required", variant: "destructive" })
        setIsSaving(false)
        return
      }
      if (!formData.price.trim()) {
        toast({ title: "Validation Error", description: "Price is required", variant: "destructive" })
        setIsSaving(false)
        return
      }
      const payload = {
        slug: formData.slug.trim() || undefined,
        title: formData.title.trim(),
        activity: formData.activity,
        location: formData.location.trim(),
        country: formData.country.trim() || "",
        duration: formData.duration.trim(),
        price: formData.price.trim(),
        rating: Number(formData.rating) || 4.5,
        reviewCount: Number(formData.reviewCount) || 0,
        image: allImages[0],
        images: allImages,
        description: formData.description,
        highlights: parseJsonOrComma(formData.highlights),
        difficulty: formData.difficulty,
        groupSize: formData.groupSize,
        type: formData.type,
        order: formData.order ? parseInt(formData.order, 10) : 0,
      }

      const url = isEditMode ? `/api/admin/trips/${editingTrip?.ID}` : "/api/admin/trips"
      const method = isEditMode ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: "Success",
          description: isEditMode ? "Trip updated successfully" : "Trip created successfully",
        })
        handleCloseDialog()
        fetchTrips()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save trip",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save trip",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/admin/trips/${deletingId}`, { method: "DELETE" })
      const result = await res.json()
      if (result.success) {
        toast({ title: "Success", description: "Trip deleted successfully" })
        setIsDeleteDialogOpen(false)
        setDeletingId(null)
        fetchTrips()
      } else {
        toast({ title: "Error", description: result.error || "Failed to delete trip", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete trip", variant: "destructive" })
    }
  }

  const activityLabelByValue = useMemo(() => {
    const map = new Map(ACTIVITY_OPTIONS.map((o) => [o.value, o.label]))
    return map
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Trips (by Activity)</h2>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Trip
        </Button>
      </div>

      <div className="grid gap-4">
        {trips.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">No trips found. Create your first trip!</p>
          </div>
        ) : (
          trips.map((trip) => (
            <div key={trip.ID} className="bg-card border border-border rounded-lg p-6 flex gap-4 items-start">
              <div className="shrink-0">
                <img
                  src={trip.image || "/placeholder.svg"}
                  alt={trip.title}
                  className="w-28 h-28 object-cover rounded-lg border border-border"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-white mb-1 truncate">{trip.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {trip.location}
                      {trip.country ? ` • ${trip.country}` : ""} • {trip.duration} • {trip.price}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {activityLabelByValue.get(trip.activity) || trip.activity}
                      </span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded capitalize">
                        {trip.type}
                      </span>
                      {trip.images?.length ? (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          Images: {trip.images.length}
                        </span>
                      ) : null}
                      {trip.difficulty ? (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {trip.difficulty}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(trip)}
                      className="hover:bg-primary hover:text-primary-foreground"
                      title="Edit Trip"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeletingId(trip.ID)
                        setIsDeleteDialogOpen(true)
                      }}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                {trip.description ? (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Trip" : "Add New Trip"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update trip information" : "Fill in the details to add a new trip"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Slug (optional)</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated if empty"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Activity *</label>
                <Select
                  value={formData.activity}
                  onValueChange={(value) => setFormData({ ...formData, activity: value as ActivitySlug })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Type *</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as "domestic" | "international" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Country</label>
                <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Duration *</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 5 Days"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Price *</label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. ₹18,999"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Difficulty</label>
                <Input
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  placeholder="e.g. Moderate"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Group Size</label>
                <Input
                  value={formData.groupSize}
                  onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                  placeholder="e.g. Max 12 people"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value || "4.5") })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Review Count</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.reviewCount}
                  onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value || "0", 10) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Order</label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Highlights 
              </label>
              <Textarea
                value={formData.highlights}
                onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                rows={3}
                placeholder='  Highlight 1, Highlight 2'
              />
            </div>

            {/* Images */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white block">
                  Trip Images {imagesList.length > 0 ? `(${imagesList.length})` : ""}
                </label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add URL
                  </Button>
                  <label className="inline-flex">
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    <Button type="button" variant="outline" size="sm" disabled={isUploading} asChild>
                      <span>
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {imagePreview ? (
                <div className="border border-border rounded-lg p-3 bg-background/50">
                  <p className="text-xs text-muted-foreground mb-2">Main Image Preview</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-cover rounded-md border border-border"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-6 border border-border rounded-lg bg-muted/20">
                  <p className="text-sm text-muted-foreground">No images added yet</p>
                </div>
              )}

              {imagesList.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imagesList.map((img, idx) => (
                    <div key={`${img}-${idx}`} className="relative border border-border rounded-lg overflow-hidden bg-background">
                      <img
                        src={img}
                        alt={`Trip image ${idx + 1}`}
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        {idx === 0 ? (
                          <span className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded-full">
                            Main
                          </span>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-7 px-2 text-[10px]"
                            onClick={() => handleSetMainImage(idx)}
                          >
                            Set Main
                          </Button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center"
                        aria-label={`Remove image ${idx + 1}`}
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                {imagesList.length > 0
                  ? `Will save ${imagesList.length} image${imagesList.length !== 1 ? "s" : ""}.`
                  : "Add at least 1 image."}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditMode ? "Update Trip" : "Save Trip"}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trip.
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

