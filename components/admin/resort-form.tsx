"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Loader2, Save, X, Upload, MessageCircle } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Resort {
  ID: string
  Name: string
  Resorts_Name: string
  Image: string
  Images?: string[] // Array of image URLs
  Room_Types?: Array<{
    name: string
    price?: string
    image?: string
    description?: string
    amenities?: string[]
  }>
  Short_Description: string
  address_tile: string
  Room_Amenities1: string | null
  Room_Amenities2: string | null
  Room_Amenities3: string | null
  Room_Amenities4: string | null
  Resort_Amenities1: string | null
  Resort_Amenities2: string | null
  Resort_Amenities3: string | null
  Resort_Amenities4: string | null
  Tags: string | null
  Mood: string | null
  Activities: string | null
  Price: string | null
  Type: 'domestic' | 'international' | null
  order: string | null
}

export default function ResortForm() {
  const { toast } = useToast()
  const [resorts, setResorts] = useState<Resort[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingResort, setEditingResort] = useState<Resort | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagesList, setImagesList] = useState<string[]>([]) // Multiple images
  const [isUploading, setIsUploading] = useState(false)
  const [roomTypes, setRoomTypes] = useState<
    Array<{ name: string; price: string; image: string; description: string; amenitiesText: string }>
  >([])
  const [roomTypeUploadingIndex, setRoomTypeUploadingIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    Name: "",
    Resorts_Name: "",
    Image: "",
    Short_Description: "",
    address_tile: "",
    Room_Amenities1: "",
    Room_Amenities2: "",
    Room_Amenities3: "",
    Room_Amenities4: "",
    Resort_Amenities1: "",
    Resort_Amenities2: "",
    Resort_Amenities3: "",
    Resort_Amenities4: "",
    Tags: "",
    Mood: "",
    Activities: "",
    Price: "",
    Type: "domestic" as "domestic" | "international",
    order: "",
  })

  const toAmenitiesText = (amenities?: string[]) => (Array.isArray(amenities) ? amenities.join(", ") : "")
  const parseAmenitiesText = (text: string) =>
    text
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)

  const handleRoomTypeImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      if (!file.type.startsWith("image/")) {
        toast({ title: "Invalid File", description: "Please select an image file.", variant: "destructive" })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File Too Large", description: "Image must be under 5MB.", variant: "destructive" })
        return
      }
      setRoomTypeUploadingIndex(index)
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)
      const response = await fetch("/api/upload", { method: "POST", body: uploadFormData })
      const result = await response.json()
      if (!result?.success || !result?.path) {
        throw new Error(result?.error || "Upload failed")
      }
      setRoomTypes((prev) => prev.map((rt, i) => (i === index ? { ...rt, image: result.path } : rt)))
      toast({ title: "Success", description: "Room image uploaded." })
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: err instanceof Error ? err.message : "Failed to upload room image",
        variant: "destructive",
      })
    } finally {
      setRoomTypeUploadingIndex(null)
      e.target.value = ""
    }
  }

  useEffect(() => {
    fetchResorts()
  }, [])

  const fetchResorts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/resorts")
      const result = await response.json()

      if (result.success) {
        setResorts(result.data || [])
      } else {
        console.error('Fetch error:', result)
        toast({
          title: "Error",
          description: result.error || "Failed to fetch resorts",
          variant: "destructive",
        })
        setResorts([])
      }
    } catch (error) {
      console.error('Fetch exception:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch resorts",
        variant: "destructive",
      })
      setResorts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (resort?: Resort) => {
    if (resort) {
      setEditingResort(resort)
      const imageUrl = typeof resort.Image === 'string' ? resort.Image : JSON.stringify(resort.Image)
      
      // Get images array or fallback to single image
      let images: string[] = []
      if (resort.Images && Array.isArray(resort.Images) && resort.Images.length > 0) {
        // Use Images array, filter out empty values
        images = resort.Images.filter((img): img is string => Boolean(img && typeof img === 'string' && img.trim()))
      } else if (imageUrl) {
        // Fallback to single Image
        images = [imageUrl]
      }
      
      // Ensure we have at least the main image
      if (images.length === 0 && imageUrl) {
        images = [imageUrl]
      }
      
      setFormData({
        Name: resort.Name || "",
        Resorts_Name: resort.Resorts_Name || "",
        Image: images[0] || imageUrl || "", // Use first image from array or fallback
        Short_Description: resort.Short_Description || "",
        address_tile: resort.address_tile || "",
        Room_Amenities1: resort.Room_Amenities1 || "",
        Room_Amenities2: resort.Room_Amenities2 || "",
        Room_Amenities3: resort.Room_Amenities3 || "",
        Room_Amenities4: resort.Room_Amenities4 || "",
        Resort_Amenities1: resort.Resort_Amenities1 || "",
        Resort_Amenities2: resort.Resort_Amenities2 || "",
        Resort_Amenities3: resort.Resort_Amenities3 || "",
        Resort_Amenities4: resort.Resort_Amenities4 || "",
        Tags: resort.Tags || "",
        Mood: resort.Mood || "",
        Activities: resort.Activities || "",
        Price: resort.Price || "",
        Type: (resort.Type || "domestic") as "domestic" | "international",
        order: resort.order || "",
      })
      setImagePreview(images[0] || null)
      setImagesList(images) // Set all images to the list
      setRoomTypes(
        Array.isArray(resort.Room_Types) && resort.Room_Types.length > 0
          ? resort.Room_Types.map((rt) => ({
              name: String(rt.name || "").trim(),
              price: String(rt.price || "").trim(),
              image: String((rt as any).image || (rt as any).Image || ""),
              description: String((rt as any).description || (rt as any).Description || ""),
              amenitiesText: toAmenitiesText(rt.amenities),
            }))
          : []
      )
      
      console.log('Loaded resort images:', {
        totalImages: images.length,
        images: images,
        mainImage: images[0]
      })
    } else {
      setEditingResort(null)
      setFormData({
        Name: "",
        Resorts_Name: "",
        Image: "",
        Short_Description: "",
        address_tile: "",
        Room_Amenities1: "",
        Room_Amenities2: "",
        Room_Amenities3: "",
        Room_Amenities4: "",
        Resort_Amenities1: "",
        Resort_Amenities2: "",
        Resort_Amenities3: "",
        Resort_Amenities4: "",
        Tags: "",
        Mood: "",
        Activities: "",
        Price: "",
        Type: "domestic" as "domestic" | "international",
        order: "",
      })
      setImagePreview(null)
      setImagesList([])
      setRoomTypes([])
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingResort(null)
    setImagePreview(null)
    setImagesList([])
    setRoomTypes([])
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
      // Combine existing images with new uploads, avoiding duplicates
      const existingImages = imagesList.filter(img => img && img.trim())
      const newImages = [...existingImages, ...uploadedPaths.filter(path => !existingImages.includes(path))]
      setImagesList(newImages)
      
      // Set first image as preview and main image if not set
      if (newImages.length > 0) {
        if (!imagePreview || !formData.Image) {
          setImagePreview(newImages[0])
          setFormData(prev => ({ ...prev, Image: newImages[0] }))
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
      // Reset input
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = imagesList.filter((_, i) => i !== index)
    setImagesList(newImages)
    
    if (newImages.length > 0) {
      setImagePreview(newImages[0])
      setFormData(prev => ({ ...prev, Image: newImages[0] }))
    } else {
      setImagePreview(null)
      setFormData(prev => ({ ...prev, Image: "" }))
    }
  }

  const handleAddImageUrl = () => {
    const url = prompt("Enter image URL:")
    if (url && url.trim()) {
      const trimmedUrl = url.trim()
      // Add URL if not already in list
      if (!imagesList.includes(trimmedUrl)) {
        const newImages = [trimmedUrl, ...imagesList]
        setImagesList(newImages)
      } else {
        // If already exists, move it to first position
        const newImages = [trimmedUrl, ...imagesList.filter(img => img !== trimmedUrl)]
        setImagesList(newImages)
      }
      // Always set as preview and main image
      setImagePreview(trimmedUrl)
      setFormData(prev => ({ ...prev, Image: trimmedUrl }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const url = editingResort
        ? `/api/admin/resorts/${editingResort.ID}`
        : "/api/admin/resorts"
      const method = editingResort ? "PUT" : "POST"

      // Collect ALL images - prioritize imagesList, but ensure formData.Image is included
      let allImages: string[] = []
      
      // Start with imagesList (which should contain all uploaded and manually added images)
      if (imagesList && imagesList.length > 0) {
        allImages = [...imagesList.filter(img => img && img.trim())]
      }
      
      // If formData.Image exists and is not in the list, add it as the first image
      if (formData.Image && formData.Image.trim()) {
        const imageUrl = formData.Image.trim()
        if (!allImages.includes(imageUrl)) {
          allImages = [imageUrl, ...allImages.filter(img => img !== imageUrl)]
        } else {
          // If it's already in the list, move it to first position
          allImages = [imageUrl, ...allImages.filter(img => img !== imageUrl)]
        }
      }
      
      // Remove any duplicates and empty strings
      allImages = Array.from(new Set(allImages.filter(img => img && img.trim())))
      
      if (allImages.length === 0) {
        toast({
          title: "Error",
          description: "At least one image is required",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // Prepare data with Images array - always send all images
      const submitData = {
        ...formData,
        Image: allImages[0], // First image as main image (for backward compatibility)
        Images: allImages, // All images for gallery
        Room_Types:
          roomTypes && roomTypes.length > 0
            ? roomTypes
                .map((rt) => ({
                  name: rt.name.trim(),
                  price: rt.price.trim(),
                  image: rt.image?.trim() || "",
                  description: rt.description?.trim() || "",
                  amenities: parseAmenitiesText(rt.amenitiesText),
                }))
                .filter((rt) => rt.name)
            : [],
      }
      
      console.log('Submitting resort with images:', {
        totalImages: allImages.length,
        images: allImages,
        mainImage: allImages[0],
        imagesListLength: imagesList.length,
        formDataImage: formData.Image
      })

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (result.success) {
        const imagesCount = result.imagesCount || allImages.length
        toast({
          title: "Success",
          description: editingResort
            ? `Resort updated successfully with ${imagesCount} image${imagesCount !== 1 ? 's' : ''}`
            : `Resort created successfully with ${imagesCount} image${imagesCount !== 1 ? 's' : ''}`,
        })
        console.log('Resort saved successfully:', {
          imagesCount: imagesCount,
          images: allImages
        })
        handleCloseDialog()
        fetchResorts()
      } else {
        console.error('Save error:', result)
        toast({
          title: "Error",
          description: result.error || "Failed to save resort",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Save exception:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save resort",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const response = await fetch(`/api/admin/resorts/${deletingId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Resort deleted successfully",
        })
        setIsDeleteDialogOpen(false)
        setDeletingId(null)
        fetchResorts()
      } else {
        console.error('Delete error:', result)
        toast({
          title: "Error",
          description: result.error || "Failed to delete resort",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Delete exception:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete resort",
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

  const handleWhatsAppClick = (resort: Resort) => {
    const phoneNumber = "918588855935"
    const message = `Hi! I'm interested in ${resort.Resorts_Name || resort.Name}. Can you provide more details?`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 md:gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Manage Resorts</h2>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto h-11 md:h-10 text-sm md:text-base font-medium"
          size="default"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Add New Resort
        </Button>
      </div>

      {resorts.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 md:p-12 text-center">
          <p className="text-muted-foreground text-base md:text-lg">No resorts found. Add your first resort to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-4">
          {resorts.map((resort) => (
            <div
              key={resort.ID}
              className="bg-card border border-border rounded-xl md:rounded-lg overflow-hidden hover:shadow-xl transition-all duration-200 relative"
            >
              {/* Promotional Bubble - Overlay on Image */}
              <div className="absolute top-3 right-3 z-20 bg-white/95 text-gray-900 text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="whitespace-nowrap">Want exclusive holiday packages?</span>
              </div>

              {/* Mobile Layout: Stacked */}
              <div className="flex flex-col md:flex-row">
                {/* Resort Image - Full Width on Mobile */}
                <div className="relative w-full md:w-48 md:flex-shrink-0">
                  <div className="relative aspect-[16/10] md:w-48 md:h-48 overflow-hidden">
                    <img
                      src={resort.Image || '/placeholder.svg'}
                      alt={resort.Resorts_Name || resort.Name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg'
                      }}
                    />
                    {/* Gradient overlay for better text readability on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div>
                  </div>
                  {/* Floating WhatsApp Button - Bottom Right of Image on Mobile */}
                  <button
                    onClick={() => handleWhatsAppClick(resort)}
                    className="md:hidden absolute bottom-3 right-3 w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl z-20 transition-transform hover:scale-110"
                    aria-label="Contact via WhatsApp"
                  >
                    <MessageCircle className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Resort Details */}
                <div className="flex-1 p-4 md:p-6 flex flex-col">
                  {/* Title and Location Section */}
                  <div className="mb-3 md:mb-4">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 line-clamp-2">
                          {resort.Resorts_Name || resort.Name}
                        </h3>
                        {resort.Tags && (
                          <p className="text-sm md:text-base text-primary/90 font-semibold mb-2 capitalize">
                            {resort.Tags}
                          </p>
                        )}
                        <p className="text-base md:text-lg text-muted-foreground font-medium uppercase tracking-wide">
                          {resort.address_tile || 'No location specified'}
                        </p>
                      </div>
                      {/* Edit & Delete Buttons - Top Right on Mobile */}
                      <div className="flex gap-2 flex-shrink-0 md:hidden">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(resort)}
                          className="h-9 w-9 p-0 hover:bg-primary hover:text-primary-foreground border-white/20 bg-white/10 backdrop-blur-sm"
                          title="Edit Resort"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDeletingId(resort.ID)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="h-9 w-9 p-0 hover:bg-destructive hover:text-destructive-foreground border-red-500/30 bg-red-500/10 backdrop-blur-sm"
                          title="Delete Resort"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-2 md:line-clamp-3 flex-1">
                    {resort.Short_Description || 'No description available'}
                  </p>

                  {/* Price and Type Badges */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                    {resort.Price && (
                      <div className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 px-3 py-1.5 rounded-lg">
                        <span className="text-xs text-muted-foreground">Price:</span>
                        <span className="text-base md:text-lg text-white font-bold">
                          {resort.Type === 'international' ? '$' : '₹'}{resort.Price}
                        </span>
                      </div>
                    )}
                    {resort.Type && (
                      <span className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold ${
                        resort.Type === 'international' 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                          : 'bg-green-500/20 text-green-300 border border-green-500/30'
                      }`}>
                        {resort.Type === 'international' ? 'International' : 'Domestic'}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons - Desktop Layout & Mobile Bottom */}
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-2 pt-2 border-t border-border/50">
                    {/* Desktop: Edit & Delete */}
                    <div className="hidden md:flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(resort)}
                        className="flex-1 hover:bg-primary hover:text-primary-foreground border-primary/30"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeletingId(resort.ID)
                          setIsDeleteDialogOpen(true)
                        }}
                        className="flex-1 hover:bg-destructive hover:text-destructive-foreground border-red-500/30 text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    {/* Mobile: Full Width Buttons */}
                    <div className="flex gap-2 md:hidden">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(resort)}
                        className="flex-1 h-11 hover:bg-primary hover:text-primary-foreground border-primary/30 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeletingId(resort.ID)
                          setIsDeleteDialogOpen(true)
                        }}
                        className="flex-1 h-11 hover:bg-destructive hover:text-destructive-foreground border-red-500/30 text-red-400 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    {/* Desktop: WhatsApp */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWhatsAppClick(resort)}
                      className="hidden md:flex bg-green-500/10 border-green-500/30 text-green-300 hover:bg-green-500/20 hover:text-green-200"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {editingResort ? "Edit Resort" : "Add New Resort"}
            </DialogTitle>
            <DialogDescription>
              {editingResort
                ? "Update resort information"
                : "Fill in the details to add a new resort"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Name</label>
                <Input
                  value={formData.Name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Resort Name</label>
                <Input
                  value={formData.Resorts_Name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, Resorts_Name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Resort Images <span className="text-xs text-muted-foreground">(First image will be shown on card)</span>
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
                                // Move to first position
                                const newImages = [img, ...imagesList.filter((_, i) => i !== index)]
                                setImagesList(newImages)
                                setImagePreview(newImages[0])
                                setFormData(prev => ({ ...prev, Image: newImages[0] }))
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
                  Or enter image URL manually (will be added to gallery):
                </div>
                <Input
                  value={formData.Image || ''}
                  onChange={(e) => {
                    const url = e.target.value.trim()
                    setFormData(prev => ({ ...prev, Image: url }))
                    
                    // Always ensure the URL is in imagesList as the first image
                    if (url) {
                      // Remove the URL from anywhere in the list and add it as first
                      const filteredList = imagesList.filter(img => img !== url && img.trim())
                      const newImagesList = [url, ...filteredList]
                      setImagesList(newImagesList)
                      setImagePreview(url)
                    } else {
                      // If URL is cleared, keep existing imagesList but update preview
                      setImagePreview(imagesList[0] || null)
                    }
                  }}
                  placeholder="/image.jpg or /uploads/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">Location</label>
              <Input
                value={formData.address_tile || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, address_tile: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">Type *</label>
              <Select
                value={formData.Type}
                onValueChange={(value: "domestic" | "international") =>
                  setFormData(prev => ({ ...prev, Type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domestic">Domestic (₹ Indian Rupee)</SelectItem>
                  <SelectItem value="international">International ($ USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">Price Per Night</label>
              <Input
                value={formData.Price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, Price: e.target.value }))}
                placeholder="₹5,000 or $100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                If you add Room Types below, the resort card will show the lowest room price.
              </p>
            </div>

            <div className="border border-border rounded-2xl p-4 bg-background/30">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <label className="text-sm font-medium text-white block">Room Types (optional)</label>
                  <p className="text-xs text-muted-foreground">
                    Add multiple room types with different prices and amenities.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setRoomTypes((prev) => [
                      ...prev,
                        { name: `Room Type ${prev.length + 1}`, price: "", image: "", description: "", amenitiesText: "" },
                    ])
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room Type
                </Button>
              </div>

              {roomTypes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No room types added.</p>
              ) : (
                <div className="space-y-3">
                  {roomTypes.map((rt, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-card/50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                          <div className="sm:col-span-2">
                            <label className="text-xs text-muted-foreground block mb-1">Room Image</label>
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="h-16 w-24 rounded-lg overflow-hidden border border-border bg-background/40">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={rt.image || "/placeholder.svg"}
                                  alt={`${rt.name || "Room"} image`}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                                  }}
                                />
                              </div>
                              <label className="cursor-pointer">
                                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors border border-border text-sm">
                                  {roomTypeUploadingIndex === idx ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                      <span className="text-muted-foreground">Uploading...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-muted-foreground">Upload Room Image</span>
                                    </>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleRoomTypeImageUpload(idx, e)}
                                  className="hidden"
                                  disabled={roomTypeUploadingIndex !== null}
                                />
                              </label>
                              <Input
                                value={rt.image}
                                onChange={(e) => {
                                  const val = e.target.value
                                  setRoomTypes((prev) => prev.map((x, i) => (i === idx ? { ...x, image: val } : x)))
                                }}
                                placeholder="/uploads/room.jpg or URL"
                                className="flex-1 min-w-[240px]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1">Room Type Name *</label>
                            <Input
                              value={rt.name}
                              onChange={(e) => {
                                const val = e.target.value
                                setRoomTypes((prev) => prev.map((x, i) => (i === idx ? { ...x, name: val } : x)))
                              }}
                              placeholder="e.g. Deluxe Room"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1">Price (per night)</label>
                            <Input
                              value={rt.price}
                              onChange={(e) => {
                                const val = e.target.value
                                setRoomTypes((prev) => prev.map((x, i) => (i === idx ? { ...x, price: val } : x)))
                              }}
                              placeholder="₹7,999 or $149"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs text-muted-foreground block mb-1">Room Description</label>
                            <Textarea
                              value={rt.description}
                              onChange={(e) => {
                                const val = e.target.value
                                setRoomTypes((prev) => prev.map((x, i) => (i === idx ? { ...x, description: val } : x)))
                              }}
                              rows={2}
                              placeholder="Write a short description for this room type..."
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-xs text-muted-foreground block mb-1">Room Amenities</label>
                            <Textarea
                              value={rt.amenitiesText}
                              onChange={(e) => {
                                const val = e.target.value
                                setRoomTypes((prev) => prev.map((x, i) => (i === idx ? { ...x, amenitiesText: val } : x)))
                              }}
                              rows={2}
                              placeholder="WiFi, Balcony, Breakfast, AC"
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setRoomTypes((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          title="Remove room type"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">Description</label>
              <Textarea
                value={formData.Short_Description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, Short_Description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Room Amenities 1</label>
                <Textarea
                  value={formData.Room_Amenities1 || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, Room_Amenities1: e.target.value }))}
                  rows={2}
                  placeholder='JSON array or comma-separated'
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Room Amenities 2</label>
                <Textarea
                  value={formData.Room_Amenities2 || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, Room_Amenities2: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Resort Amenities 1</label>
                <Textarea
                  value={formData.Resort_Amenities1 || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, Resort_Amenities1: e.target.value }))}
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Resort Amenities 2</label>
                <Textarea
                  value={formData.Resort_Amenities2 || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, Resort_Amenities2: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Tags</label>
                <Input
                  value={formData.Tags || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, Tags: e.target.value }))}
                  placeholder="featured, popular"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Mood</label>
                <Input
                  value={formData.Mood || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, Mood: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">Activities</label>
              <Input
                value={formData.Activities || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, Activities: e.target.value }))}
                placeholder="Comma-separated or JSON array"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">Order</label>
              <Input
                type="number"
                value={formData.order || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
              />
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
              This action cannot be undone. This will permanently delete the resort.
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
