"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Edit, Trash2, Loader2, Save, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface Destination {
  ID: string
  name: string
  country: string
  trips: number
  image: string
  slug: string
  isPopular: boolean
  order: string | null
}

export default function DestinationForm() {
  const { toast } = useToast()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Destination | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formError, setFormError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    trips: 0,
    image: "",
    slug: "",
    isPopular: true,
    order: "",
  })

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/destinations")
      const json = await res.json()
      if (json.success) {
        setDestinations(json.data || [])
      } else {
        toast({ title: "Error", description: json.error || "Failed to fetch destinations", variant: "destructive" })
        setDestinations([])
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to fetch destinations", variant: "destructive" })
      setDestinations([])
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setEditing(null)
    setFormError("")
    setFormData({
      name: "",
      country: "",
      trips: 0,
      image: "",
      slug: "",
      isPopular: true,
      order: "",
    })
    setImagePreview("")
  }

  const handleOpen = (d?: Destination) => {
    if (d) {
      setEditing(d)
      setFormData({
        name: d.name || "",
        country: d.country || "",
        trips: Number(d.trips) || 0,
        image: d.image || "",
        slug: d.slug || "",
        isPopular: d.isPopular ?? true,
        order: d.order || "",
      })
      setImagePreview(d.image || "")
    } else {
      reset()
    }
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    reset()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploading(true)
    setFormError("")
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      let json: any = null
      try {
        json = await res.json()
      } catch {
        json = null
      }
      if (!res.ok || !json?.success) {
        const msg = json?.error || json?.message || `Upload failed (${res.status})`
        throw new Error(msg)
      }

      setFormData((p) => ({ ...p, image: json.path }))
      setImagePreview(json.path)
      toast({ title: "Success", description: "Image uploaded successfully" })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload image"
      setFormError(msg)
      toast({
        title: "Upload Failed",
        description: msg,
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
    setFormError("")
    try {
      if (!formData.name.trim()) {
        toast({ title: "Validation Error", description: "Name is required", variant: "destructive" })
        setFormError("Name is required")
        setIsSaving(false)
        return
      }
      if (!formData.country.trim()) {
        toast({ title: "Validation Error", description: "Country/Region label is required", variant: "destructive" })
        setFormError("Country/Region label is required")
        setIsSaving(false)
        return
      }
      const url = editing ? `/api/admin/destinations/${editing.ID}` : "/api/admin/destinations"
      const method = editing ? "PUT" : "POST"

      const payload = {
        name: formData.name.trim(),
        country: formData.country.trim(),
        trips: Number(formData.trips) || 0,
        image: formData.image.trim() || "/placeholder.svg",
        slug: formData.slug.trim() || undefined,
        isPopular: Boolean(formData.isPopular),
        order: formData.order ? parseInt(formData.order, 10) : 0,
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      let json: any = null
      try {
        json = await res.json()
      } catch {
        json = null
      }
      if (res.ok && json?.success) {
        toast({ title: "Success", description: editing ? "Destination updated" : "Destination created" })
        handleClose()
        fetchDestinations()
      } else {
        const errMsg =
          (json && (json.error || json.message)) ||
          (!res.ok ? `Request failed (${res.status})` : "Failed to save destination")
        console.error("Destination save failed:", { status: res.status, json, payload })
        setFormError(errMsg)
        toast({ title: "Error", description: errMsg, variant: "destructive" })
      }
    } catch (err) {
      console.error("Destination save exception:", err)
      setFormError(err instanceof Error ? err.message : "Failed to save destination")
      toast({ title: "Error", description: "Failed to save destination", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/admin/destinations/${deletingId}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        toast({ title: "Success", description: "Destination deleted" })
        setIsDeleteDialogOpen(false)
        setDeletingId(null)
        fetchDestinations()
      } else {
        toast({ title: "Error", description: json.error || "Failed to delete destination", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete destination", variant: "destructive" })
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Popular Destinations</h2>
        <Button onClick={() => handleOpen()} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Destination
        </Button>
      </div>

      <div className="grid gap-4">
        {destinations.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">No destinations found. Add your first destination!</p>
          </div>
        ) : (
          destinations.map((d) => (
            <div key={d.ID} className="bg-card border border-border rounded-lg p-6 flex gap-4 items-start">
              <div className="shrink-0">
                <img
                  src={d.image || "/placeholder.svg"}
                  alt={d.name}
                  className="w-28 h-28 object-cover rounded-lg border border-border"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-white mb-1 truncate">{d.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {d.country} • {d.trips} Trips Available • slug: {d.slug}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpen(d)}
                      className="hover:bg-primary hover:text-primary-foreground"
                      title="Edit Destination"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeletingId(d.ID)
                        setIsDeleteDialogOpen(true)
                      }}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      title="Delete Destination"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Destination" : "Add Destination"}</DialogTitle>
            <DialogDescription>
              This will be shown in the homepage “Popular Destinations” section.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
                <p className="text-sm text-destructive">{formError}</p>
              </div>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Destination Name *</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Country/Region Label *</label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. Europe / India / Asia"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Trips Available (optional)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.trips}
                  onChange={(e) => setFormData({ ...formData, trips: parseInt(e.target.value || "0", 10) })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  If you add Destination Trips, this number will automatically show the real trip count.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Slug (used in /trips/[slug])</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated if empty (e.g. new-zealand)"
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-white mb-2 block">Image *</label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value })
                    setImagePreview(e.target.value)
                  }}
                  placeholder="Paste image URL or upload"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label="Upload destination image"
                  title="Upload destination image"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload destination image"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg border border-border"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                  }}
                />
              ) : null}
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
                    {editing ? "Update" : "Save"}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
                <X className="w-4 h-4 mr-2" />
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
              This action cannot be undone. This will permanently delete the destination.
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

