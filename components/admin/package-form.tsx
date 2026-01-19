"use client"

import { useState, useEffect } from "react"
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

interface Package {
  ID: string
  slug: string
  title: string
  location: string
  country: string
  duration: string
  price: string
  rating: number
  reviewCount: number
  image: string
  images: string[]
  highlights: string[]
  activities: string[]
  type: "domestic" | "international"
  overview: string
  itinerary: any[]
  inclusions: string[]
  exclusions: string[]
  whyChoose: string[]
  whatsappMessage: string
  metaDescription?: string
  order: string | null
}

export default function PackageForm() {
  const { toast } = useToast()
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagesList, setImagesList] = useState<string[]>([]) // Multiple images
  const [isUploading, setIsUploading] = useState(false)
  const [itineraryDays, setItineraryDays] = useState<Array<{
    day: number
    title: string
    description: string
    activities: string[]
    meals: string[]
  }>>([])

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    location: "",
    country: "",
    duration: "",
    price: "",
    rating: 4.5,
    reviewCount: 0,
    image: "",
    images: "",
    highlights: "",
    activities: "",
    type: "domestic" as "domestic" | "international",
    overview: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
    whyChoose: "",
    whatsappMessage: "",
    metaDescription: "",
    order: "",
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/packages")
      const result = await response.json()

      if (result.success) {
        setPackages(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch packages",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (pkg?: Package) => {
    if (pkg) {
      setEditingPackage(pkg)
      
      // Get images array or fallback to single image
      let images: string[] = []
      if (Array.isArray(pkg.images) && pkg.images.length > 0) {
        images = pkg.images.filter((img): img is string => Boolean(img && typeof img === 'string' && img.trim()))
      } else if (pkg.image) {
        images = [pkg.image]
      }
      
      setFormData({
        slug: pkg.slug || "",
        title: pkg.title || "",
        location: pkg.location || "",
        country: pkg.country || "",
        duration: pkg.duration || "",
        price: pkg.price || "",
        rating: pkg.rating || 4.5,
        reviewCount: pkg.reviewCount || 0,
        image: images[0] || pkg.image || "",
        images: "", // Not used anymore, we use imagesList
        highlights: Array.isArray(pkg.highlights) ? JSON.stringify(pkg.highlights) : pkg.highlights || "[]",
        activities: Array.isArray(pkg.activities) ? JSON.stringify(pkg.activities) : pkg.activities || "[]",
        type: pkg.type || "domestic",
        overview: pkg.overview || "",
        itinerary: Array.isArray(pkg.itinerary) ? JSON.stringify(pkg.itinerary, null, 2) : pkg.itinerary || "[]",
        inclusions: Array.isArray(pkg.inclusions) ? JSON.stringify(pkg.inclusions) : pkg.inclusions || "[]",
        exclusions: Array.isArray(pkg.exclusions) ? JSON.stringify(pkg.exclusions) : pkg.exclusions || "[]",
        whyChoose: Array.isArray(pkg.whyChoose) ? JSON.stringify(pkg.whyChoose) : pkg.whyChoose || "[]",
        whatsappMessage: pkg.whatsappMessage || "",
        metaDescription: pkg.metaDescription || "",
        order: pkg.order || "",
      })
      setImagePreview(images[0] || null)
      setImagesList(images)
      
      // Load itinerary
      let itinerary: any[] = []
      if (Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0) {
        itinerary = pkg.itinerary
      } else if (pkg.itinerary) {
        try {
          itinerary = JSON.parse(pkg.itinerary)
        } catch {
          itinerary = []
        }
      }
      setItineraryDays(itinerary)
    } else {
      setEditingPackage(null)
      setFormData({
        slug: "",
        title: "",
        location: "",
        country: "",
        duration: "",
        price: "",
        rating: 4.5,
        reviewCount: 0,
        image: "",
        images: "",
        highlights: "[]",
        activities: "[]",
        type: "domestic",
        overview: "",
        itinerary: "[]",
        inclusions: "[]",
        exclusions: "[]",
        whyChoose: "[]",
        whatsappMessage: "",
        metaDescription: "",
        order: "",
      })
      setImagePreview(null)
      setImagesList([])
      setItineraryDays([])
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingPackage(null)
    setImagePreview(null)
    setImagesList([])
    setItineraryDays([])
  }

  const addItineraryDay = () => {
    const newDay = {
      day: itineraryDays.length + 1,
      title: '',
      description: '',
      activities: [],
      meals: []
    }
    setItineraryDays([...itineraryDays, newDay])
  }

  const removeItineraryDay = (index: number) => {
    const newDays = itineraryDays.filter((_, i) => i !== index).map((day, idx) => ({
      ...day,
      day: idx + 1
    }))
    setItineraryDays(newDays)
  }

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const newDays = [...itineraryDays]
    if (field === 'activities' || field === 'meals') {
      // Handle comma-separated strings
      if (typeof value === 'string') {
        newDays[index] = {
          ...newDays[index],
          [field]: value.split(',').map(v => v.trim()).filter(Boolean)
        }
      } else {
        newDays[index] = { ...newDays[index], [field]: value }
      }
    } else {
      newDays[index] = { ...newDays[index], [field]: value }
    }
    setItineraryDays(newDays)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Validate all files
    const validFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) {
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
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        const result = await response.json()
        if (result.success) {
          return result.path
        } else {
          throw new Error(result.error || 'Upload failed')
        }
      })

      const uploadedPaths = await Promise.all(uploadPromises)
      const existingImages = imagesList.filter(img => img && img.trim())
      const newImages = [...existingImages, ...uploadedPaths.filter(path => !existingImages.includes(path))]
      setImagesList(newImages)
      
      if (newImages.length > 0) {
        if (!imagePreview || !formData.image) {
          setImagePreview(newImages[0])
          setFormData(prev => ({ ...prev, image: newImages[0] }))
        }
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
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = imagesList.filter((_, i) => i !== index)
    setImagesList(newImages)
    
    if (newImages.length > 0) {
      setImagePreview(newImages[0])
      setFormData(prev => ({ ...prev, image: newImages[0] }))
    } else {
      setImagePreview(null)
      setFormData(prev => ({ ...prev, image: "" }))
    }
  }

  const handleAddImageUrl = () => {
    const url = prompt("Enter image URL:")
    if (url && url.trim()) {
      const trimmedUrl = url.trim()
      if (!imagesList.includes(trimmedUrl)) {
        const newImages = [trimmedUrl, ...imagesList]
        setImagesList(newImages)
      } else {
        const newImages = [trimmedUrl, ...imagesList.filter(img => img !== trimmedUrl)]
        setImagesList(newImages)
      }
      setImagePreview(trimmedUrl)
      setFormData(prev => ({ ...prev, image: trimmedUrl }))
    }
  }

  const parseJsonField = (value: string): string[] => {
    if (!value) return []
    
    // If already an array, return it (shouldn't happen but handle it)
    if (Array.isArray(value)) {
      return value.map(v => String(v).trim()).filter(Boolean)
    }
    
    // Try to parse as JSON
    try {
      const parsed = JSON.parse(value)
      
      // If parsed result is an array, return it
      if (Array.isArray(parsed)) {
        return parsed.map(v => String(v).trim()).filter(Boolean)
      }
      
      // If parsed result is an object, try to extract arrays
      if (typeof parsed === 'object' && parsed !== null) {
        // Check for nested structures like { inclusions: [...] }
        if (parsed.inclusions && Array.isArray(parsed.inclusions)) {
          return parsed.inclusions.map((v: any) => String(v).trim()).filter(Boolean)
        }
        if (parsed.exclusions && Array.isArray(parsed.exclusions)) {
          return parsed.exclusions.map((v: any) => String(v).trim()).filter(Boolean)
        }
        // If object has array values, extract first array
        const arrayValues = Object.values(parsed).filter(v => Array.isArray(v))
        if (arrayValues.length > 0 && Array.isArray(arrayValues[0])) {
          return (arrayValues[0] as any[]).map((v: any) => String(v).trim()).filter(Boolean)
        }
      }
      
      return []
    } catch {
      // If not JSON, treat as comma-separated string
      return value.split(',').map(v => v.trim()).filter(Boolean)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.title.trim()) {
        toast({
          title: "Validation Error",
          description: "Title is required",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      if (!formData.location || !formData.location.trim()) {
        toast({
          title: "Validation Error",
          description: "Location is required",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      if (!formData.country || !formData.country.trim()) {
        toast({
          title: "Validation Error",
          description: "Country is required",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      if (!formData.duration || !formData.duration.trim()) {
        toast({
          title: "Validation Error",
          description: "Duration is required",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      if (!formData.price || !formData.price.trim()) {
        toast({
          title: "Validation Error",
          description: "Price is required",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      if (!formData.overview || !formData.overview.trim()) {
        toast({
          title: "Validation Error",
          description: "Overview is required",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      const url = editingPackage
        ? `/api/admin/packages/${editingPackage.ID}`
        : "/api/admin/packages"
      const method = editingPackage ? "PUT" : "POST"

      // Collect ALL images - prioritize imagesList, but ensure formData.image is included
      let allImages: string[] = []
      
      if (imagesList && imagesList.length > 0) {
        allImages = [...imagesList.filter(img => img && img.trim())]
      }
      
      if (formData.image && formData.image.trim()) {
        const imageUrl = formData.image.trim()
        if (!allImages.includes(imageUrl)) {
          allImages = [imageUrl, ...allImages.filter(img => img !== imageUrl)]
        } else {
          allImages = [imageUrl, ...allImages.filter(img => img !== imageUrl)]
        }
      }
      
      allImages = Array.from(new Set(allImages.filter(img => img && img.trim())))
      
      if (allImages.length === 0) {
        toast({
          title: "Validation Error",
          description: "At least one image is required",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // Ensure itinerary days have proper structure
      const validItinerary = itineraryDays.map((day, index) => ({
        day: day.day || index + 1,
        title: day.title || `Day ${day.day || index + 1}`,
        description: day.description || '',
        activities: Array.isArray(day.activities) ? day.activities : (typeof day.activities === 'string' ? day.activities.split(',').map(a => a.trim()).filter(Boolean) : []),
        meals: Array.isArray(day.meals) ? day.meals : (typeof day.meals === 'string' ? day.meals.split(',').map(m => m.trim()).filter(Boolean) : []),
      }))

      const payload = {
        slug: formData.slug?.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: formData.title.trim(),
        location: formData.location.trim(),
        country: formData.country.trim(),
        duration: formData.duration.trim(),
        price: formData.price.trim(),
        image: allImages[0], // First image as main image
        images: allImages, // All images for gallery
        highlights: parseJsonField(formData.highlights),
        activities: parseJsonField(formData.activities),
        itinerary: validItinerary, // Use validated itinerary
        inclusions: parseJsonField(formData.inclusions),
        exclusions: parseJsonField(formData.exclusions),
        whyChoose: parseJsonField(formData.whyChoose),
        type: formData.type || 'domestic',
        overview: formData.overview.trim(),
        rating: parseFloat(String(formData.rating)) || 4.5,
        reviewCount: parseInt(String(formData.reviewCount)) || 0,
        whatsappMessage: formData.whatsappMessage?.trim() || undefined,
        metaDescription: formData.metaDescription?.trim() || undefined,
        order: formData.order ? parseInt(String(formData.order)) : 0,
      }
      
      console.log('Submitting package with images:', {
        totalImages: allImages.length,
        images: allImages,
        mainImage: allImages[0]
      })

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        const imagesCount = result.imagesCount || allImages.length
        toast({
          title: "Success",
          description: editingPackage
            ? `Package updated successfully with ${imagesCount} image${imagesCount !== 1 ? 's' : ''}`
            : `Package created successfully with ${imagesCount} image${imagesCount !== 1 ? 's' : ''}`,
        })
        console.log('Package saved successfully:', {
          imagesCount: imagesCount,
          images: allImages
        })
        handleCloseDialog()
        fetchPackages()
      } else {
        console.error('Package save error:', result)
        const errorMessage = result.error || result.message || "Failed to save package"
        const errorDetails = result.details ? ` Details: ${typeof result.details === 'string' ? result.details : JSON.stringify(result.details)}` : ''
        toast({
          title: "Error",
          description: `${errorMessage}${errorDetails}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Package save exception:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save package"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const response = await fetch(`/api/admin/packages/${deletingId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Package deleted successfully",
        })
        setIsDeleteDialogOpen(false)
        setDeletingId(null)
        fetchPackages()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete package",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete package",
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Packages</h2>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Package
        </Button>
      </div>

      <div className="grid gap-4">
        {packages.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">No packages found. Create your first package!</p>
          </div>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg.ID}
              className="bg-card border border-border rounded-lg p-6 flex gap-4 items-start hover:border-primary/50 transition-colors"
            >
              {/* Package Image */}
              <div className="shrink-0">
                <img
                  src={pkg.image || '/placeholder.svg'}
                  alt={pkg.title}
                  className="w-32 h-32 object-cover rounded-lg border border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg'
                  }}
                />
              </div>

              {/* Package Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{pkg.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {pkg.location} {pkg.country ? `• ${pkg.country}` : ''} • {pkg.duration}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(pkg)}
                      className="hover:bg-primary hover:text-primary-foreground"
                      title="Edit Package"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeletingId(pkg.ID)
                        setIsDeleteDialogOpen(true)
                      }}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      title="Delete Package"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{pkg.overview || 'No overview available'}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="text-white font-medium">{pkg.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Type:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      pkg.type === 'international' 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {pkg.type === 'international' ? 'International' : 'Domestic'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="text-white font-medium">{pkg.rating || 4.5}</span>
                  </div>
                  {pkg.images && Array.isArray(pkg.images) && pkg.images.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Images:</span>
                      <span className="text-primary font-medium">{pkg.images.length}</span>
                    </div>
                  )}
                  {pkg.itinerary && Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Itinerary Days:</span>
                      <span className="text-white font-medium">{pkg.itinerary.length}</span>
                    </div>
                  )}
                  {pkg.order && (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Order:</span>
                      <span className="text-white">{pkg.order}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Add New Package"}
            </DialogTitle>
            <DialogDescription>
              {editingPackage
                ? "Update package information"
                : "Fill in the details to add a new package"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Auto-generated from title"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Country *</label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Type *</label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "domestic" | "international") =>
                    setFormData({ ...formData, type: value })
                  }
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Duration *</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="6 Days / 5 Nights"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Price *</label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="₹49,999"
                  required
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
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Package Images <span className="text-xs text-muted-foreground">(First image will be shown on card)</span>
                {imagesList.length > 0 && (
                  <span className="ml-2 text-xs text-primary font-semibold">
                    ({imagesList.length} image{imagesList.length !== 1 ? 's' : ''} will be saved)
                  </span>
                )}
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors border border-border">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Upload Images</span>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImageUrl}
                    className="text-xs"
                  >
                    Add Image URL
                  </Button>
                </div>
                
                {/* Image Gallery */}
                {imagesList.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {imagesList.length} image(s) - Drag to reorder (first image is main)
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {imagesList.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                            index === 0 ? 'border-primary' : 'border-border'
                          }`}>
                            <img
                              src={img}
                              alt={`Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg'
                              }}
                            />
                            {index === 0 && (
                              <div className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded">
                                Main
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors opacity-0 group-hover:opacity-100"
                              aria-label={`Remove image ${index + 1}`}
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [img, ...imagesList.filter((_, i) => i !== index)]
                                setImagesList(newImages)
                                setImagePreview(newImages[0])
                                setFormData(prev => ({ ...prev, image: newImages[0] }))
                              }}
                              className="mt-1 w-full text-[10px] text-primary hover:underline"
                            >
                              Set as main
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Or enter main image URL manually (will be added to gallery):
                </div>
                <Input
                  value={formData.image || ''}
                  onChange={(e) => {
                    const url = e.target.value.trim()
                    setFormData(prev => ({ ...prev, image: url }))
                    
                    if (url) {
                      const filteredList = imagesList.filter(img => img !== url && img.trim())
                      const newImagesList = [url, ...filteredList]
                      setImagesList(newImagesList)
                      setImagePreview(url)
                    } else {
                      setImagePreview(imagesList[0] || null)
                    }
                  }}
                  placeholder="/image.jpg or /uploads/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">Overview *</label>
              <Textarea
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Highlights (JSON array or comma-separated)</label>
                <Textarea
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  rows={3}
                  placeholder='["Highlight 1", "Highlight 2"] or Highlight 1, Highlight 2'
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Activities (JSON array or comma-separated)</label>
                <Textarea
                  value={formData.activities}
                  onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                  rows={3}
                  placeholder='["Activity 1", "Activity 2"]'
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white block">Itinerary</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItineraryDay}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Day
                </Button>
              </div>
              {itineraryDays.length === 0 ? (
                <div className="text-center py-8 border border-border rounded-lg bg-muted/20">
                  <p className="text-sm text-muted-foreground mb-2">No itinerary days added</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItineraryDay}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Day
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {itineraryDays.map((day, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 bg-card space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white">Day {day.day}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItineraryDay(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                        <Input
                          value={day.title}
                          onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                          placeholder="Day 1: Arrival"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                        <Textarea
                          value={day.description}
                          onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                          rows={3}
                          placeholder="Detailed description of the day's activities..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Activities (comma-separated)</label>
                          <Input
                            value={day.activities.join(', ')}
                            onChange={(e) => updateItineraryDay(index, 'activities', e.target.value)}
                            placeholder="Sightseeing, Shopping, etc."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Meals (comma-separated)</label>
                          <Input
                            value={day.meals.join(', ')}
                            onChange={(e) => updateItineraryDay(index, 'meals', e.target.value)}
                            placeholder="Breakfast, Lunch, Dinner"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Inclusions (JSON array or comma-separated)</label>
                <Textarea
                  value={formData.inclusions}
                  onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Exclusions (JSON array or comma-separated)</label>
                <Textarea
                  value={formData.exclusions}
                  onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">Why Choose (JSON array or comma-separated)</label>
              <Textarea
                value={formData.whyChoose}
                onChange={(e) => setFormData({ ...formData, whyChoose: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">WhatsApp Message</label>
                <Input
                  value={formData.whatsappMessage}
                  onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Order</label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
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
              This action cannot be undone. This will permanently delete the package.
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
