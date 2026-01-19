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

interface AdminDestination {
  ID: string
  name: string
  country: string
  trips: number
  image: string
  slug: string
  isPopular: boolean
  order: string | null
}

interface DestinationTrip {
  ID: string
  slug: string
  destinationSlug: string
  destinationName: string
  title: string
  location: string
  duration: string
  price: string
  rating: number
  image: string
  images: string[]
  description: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  mood: string
  activities: string[]
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

export default function DestinationTripsForm() {
  const { toast } = useToast()
  const [destinations, setDestinations] = useState<AdminDestination[]>([])
  const [trips, setTrips] = useState<DestinationTrip[]>([])
  const [selectedDestinationSlug, setSelectedDestinationSlug] = useState<string>("")

  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<DestinationTrip | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagesList, setImagesList] = useState<string[]>([])

  const [formData, setFormData] = useState({
    slug: "",
    destinationSlug: "",
    destinationName: "",
    title: "",
    location: "",
    duration: "",
    price: "",
    rating: 4.8,
    image: "",
    description: "",
    highlights: "",
    inclusions: "",
    exclusions: "",
    mood: "",
    activities: "",
    type: "international" as "domestic" | "international",
    order: "",
  })

  const isEditMode = Boolean(editingTrip)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const dRes = await fetch("/api/admin/destinations")
        const dJson = await dRes.json()
        const dests: AdminDestination[] = dJson.success ? (dJson.data || []) : []
        setDestinations(dests)
        const defaultSlug = dests[0]?.slug || ""
        setSelectedDestinationSlug(defaultSlug)
      } catch {
        setDestinations([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const selectedDestination = useMemo(() => {
    return destinations.find((d) => d.slug === selectedDestinationSlug) || null
  }, [destinations, selectedDestinationSlug])

  const fetchTrips = async (destSlug?: string) => {
    try {
      setIsLoading(true)
      const qs = destSlug ? `?destinationSlug=${encodeURIComponent(destSlug)}` : ""
      const res = await fetch(`/api/admin/destination-trips${qs}`)
      const json = await res.json()
      if (json.success) {
        setTrips(json.data || [])
      } else {
        setTrips([])
        toast({ title: "Error", description: json.error || "Failed to fetch trips", variant: "destructive" })
      }
    } catch {
      setTrips([])
      toast({ title: "Error", description: "Failed to fetch trips", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedDestinationSlug) return
    fetchTrips(selectedDestinationSlug)
  }, [selectedDestinationSlug])

  const resetForm = () => {
    setEditingTrip(null)
    setFormData({
      slug: "",
      destinationSlug: selectedDestinationSlug || "",
      destinationName: selectedDestination?.name || "",
      title: "",
      location: selectedDestination?.name || "",
      duration: "",
      price: "",
      rating: 4.8,
      image: "",
      description: "",
      highlights: "",
      inclusions: "",
      exclusions: "",
      mood: "",
      activities: "",
      type: "international",
      order: "",
    })
    setImagePreview(null)
    setImagesList([])
  }

  const handleOpenDialog = (trip?: DestinationTrip) => {
    if (trip) {
      setEditingTrip(trip)
      const imgs = trip.images?.length ? trip.images : (trip.image ? [trip.image] : [])
      setImagesList(imgs)
      setImagePreview(imgs[0] || null)
      setFormData({
        slug: trip.slug || "",
        destinationSlug: trip.destinationSlug,
        destinationName: trip.destinationName,
        title: trip.title || "",
        location: trip.location || "",
        duration: trip.duration || "",
        price: trip.price || "",
        rating: trip.rating || 4.8,
        image: imgs[0] || trip.image || "",
        description: trip.description || "",
        highlights: Array.isArray(trip.highlights) ? JSON.stringify(trip.highlights) : "",
        inclusions: Array.isArray(trip.inclusions) ? JSON.stringify(trip.inclusions) : "",
        exclusions: Array.isArray(trip.exclusions) ? JSON.stringify(trip.exclusions) : "",
        mood: trip.mood || "",
        activities: Array.isArray(trip.activities) ? JSON.stringify(trip.activities) : "",
        type: trip.type || "international",
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
      if (!file.type.startsWith("image/")) continue
      if (file.size > 5 * 1024 * 1024) continue
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

      const uploaded = await Promise.all(uploadPromises)
      const merged = [...imagesList, ...uploaded.filter((p) => !imagesList.includes(p))]
      setImagesList(merged)

      if (merged.length > 0 && (!imagePreview || !formData.image)) {
        setImagePreview(merged[0])
        setFormData((prev) => ({ ...prev, image: merged[0] }))
      }
      toast({ title: "Success", description: `${uploaded.length} image(s) uploaded` })
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: err instanceof Error ? err.message : "Failed to upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const dest = destinations.find((d) => d.slug === formData.destinationSlug) || selectedDestination
      if (!dest) {
        toast({ title: "Validation Error", description: "Destination is required", variant: "destructive" })
        setIsSaving(false)
        return
      }

      // images
      let allImages = imagesList.filter((img) => img && img.trim())
      if (formData.image && formData.image.trim()) {
        const main = formData.image.trim()
        allImages = [main, ...allImages.filter((i) => i !== main)]
      }
      allImages = Array.from(new Set(allImages))
      if (allImages.length === 0) {
        toast({ title: "Validation Error", description: "At least one image is required", variant: "destructive" })
        setIsSaving(false)
        return
      }

      const payload = {
        slug: formData.slug.trim() || undefined,
        destinationSlug: dest.slug,
        destinationName: dest.name,
        title: formData.title.trim(),
        location: (formData.location || dest.name).trim(),
        duration: formData.duration.trim(),
        price: formData.price.trim(),
        rating: Number(formData.rating) || 4.8,
        image: allImages[0],
        images: allImages,
        description: formData.description,
        highlights: parseJsonOrComma(formData.highlights),
        inclusions: parseJsonOrComma(formData.inclusions),
        exclusions: parseJsonOrComma(formData.exclusions),
        mood: formData.mood,
        activities: parseJsonOrComma(formData.activities),
        type: formData.type,
        order: formData.order ? parseInt(formData.order, 10) : 0,
      }

      if (!payload.title) {
        toast({ title: "Validation Error", description: "Title is required", variant: "destructive" })
        setIsSaving(false)
        return
      }
      if (!payload.duration) {
        toast({ title: "Validation Error", description: "Duration is required", variant: "destructive" })
        setIsSaving(false)
        return
      }
      if (!payload.price) {
        toast({ title: "Validation Error", description: "Price is required", variant: "destructive" })
        setIsSaving(false)
        return
      }

      const url = isEditMode ? `/api/admin/destination-trips/${editingTrip?.ID}` : "/api/admin/destination-trips"
      const method = isEditMode ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        toast({ title: "Success", description: isEditMode ? "Trip updated" : "Trip created" })
        handleCloseDialog()
        fetchTrips(selectedDestinationSlug)
      } else {
        toast({ title: "Error", description: json.error || "Failed to save trip", variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to save trip", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/admin/destination-trips/${deletingId}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        toast({ title: "Success", description: "Trip deleted" })
        setIsDeleteDialogOpen(false)
        setDeletingId(null)
        fetchTrips(selectedDestinationSlug)
      } else {
        toast({ title: "Error", description: json.error || "Failed to delete", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
    }
  }

  if (isLoading && destinations.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Destination Trips</h2>
          <p className="text-sm text-muted-foreground">Add trips that appear when users click a destination card.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Trip
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="w-full md:max-w-sm">
          <Select value={selectedDestinationSlug} onValueChange={setSelectedDestinationSlug}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((d) => (
                <SelectItem key={d.ID} value={d.slug}>
                  {d.name} ({d.country})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedDestination ? (
          <p className="text-sm text-muted-foreground">
            Showing trips for <span className="text-white font-semibold">{selectedDestination.name}</span>
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground">No trips for this destination yet. Add one!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {trips.map((t) => (
            <div key={t.ID} className="bg-card border border-border rounded-lg p-6 flex gap-4 items-start">
              <div className="shrink-0">
                <img
                  src={t.image || "/placeholder.svg"}
                  alt={t.title}
                  className="w-28 h-28 object-cover rounded-lg border border-border"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-white mb-1 truncate">{t.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {t.destinationName} • {t.duration} • {t.price}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded capitalize">{t.type}</span>
                      {t.mood ? (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">{t.mood}</span>
                      ) : null}
                      {t.images?.length ? (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          Images: {t.images.length}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(t)}
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
                        setDeletingId(t.ID)
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Destination Trip" : "Add Destination Trip"}</DialogTitle>
            <DialogDescription>Trips added here will appear under `/trips/[destination]`.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Destination *</label>
                <Select
                  value={formData.destinationSlug || selectedDestinationSlug}
                  onValueChange={(value) => {
                    const d = destinations.find((x) => x.slug === value)
                    setFormData((p) => ({
                      ...p,
                      destinationSlug: value,
                      destinationName: d?.name || "",
                      location: p.location || d?.name || "",
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((d) => (
                      <SelectItem key={d.ID} value={d.slug}>
                        {d.name} ({d.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Trip Title *</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Type *</label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="international">International</SelectItem>
                    <SelectItem value="domestic">Domestic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Slug (optional)</label>
                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Location *</label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Duration *</label>
                <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Price *</label>
                <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value || "4.8") })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Mood</label>
                <Input value={formData.mood} onChange={(e) => setFormData({ ...formData, mood: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Order</label>
                <Input value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white mb-2 block">Description (what we provide)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Write trip overview / what you will provide..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Highlights (JSON array or comma-separated)
                </label>
                <Textarea
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Activities (JSON array or comma-separated)
                </label>
                <Textarea
                  value={formData.activities}
                  onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Inclusions (JSON array or comma-separated)
                </label>
                <Textarea
                  value={formData.inclusions}
                  onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Exclusions (JSON array or comma-separated)
                </label>
                <Textarea
                  value={formData.exclusions}
                  onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                  rows={3}
                />
              </div>
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

