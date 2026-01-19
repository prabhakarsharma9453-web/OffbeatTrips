"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, Star, Check, X, MessageCircle, Home, Loader2, Sparkles, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface ResortDetails {
  id: string
  title: string
  name: string
  location: string
  fullLocation: string
  price: string
  rating: number
  image: string
  images: string[]
  roomTypes?: Array<{
    name: string
    price: string
    image?: string
    description?: string
    amenities: string[]
  }>
  amenities: string[]
  activities: string[]
  description: string
  addressTile: string
  tags: string
  mood: string
  featured: boolean
  popular: boolean
  type: 'domestic' | 'international'
}

export default function ResortDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const resortId = params?.id as string
  const [resort, setResort] = useState<ResortDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [selectedRoomType, setSelectedRoomType] = useState<string>("")
  const [expandedRoomType, setExpandedRoomType] = useState<string | null>(null)

  useEffect(() => {
    const fetchResort = async () => {
      if (!resortId) return

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/resorts/${resortId}`)
        const result = await response.json()

        if (result.success) {
          setResort(result.data)
          setSelectedImageIndex(0) // Reset to first image
          const firstRoom = result.data?.roomTypes?.[0]?.name
          setSelectedRoomType(firstRoom || "")
          console.log('Resort loaded with images:', {
            totalImages: result.data.images?.length || 0,
            images: result.data.images,
            mainImage: result.data.image
          })
        } else {
          setError(result.error || 'Resort not found')
        }
      } catch (err) {
        console.error('Error fetching resort:', err)
        setError('Failed to load resort details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResort()
  }, [resortId])

  const handleWhatsApp = () => {
    if (!resort) return
    const roomText = selectedRoomType ? ` Room Type: ${selectedRoomType}.` : ''
    const message = encodeURIComponent(
      `Hi! I'm interested in ${resort.title} at ${resort.location}.${roomText} Please provide more details.`
    )
    window.open(`https://wa.me/918588855935?text=${message}`, "_blank", "noopener,noreferrer")
  }

  const handleNextImage = () => {
    if (!resort || galleryImages.length === 0) return
    handleUserInteraction()
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const handlePreviousImage = () => {
    if (!resort || galleryImages.length === 0) return
    handleUserInteraction()
    setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const handleThumbnailClick = (index: number) => {
    handleUserInteraction()
    setSelectedImageIndex(index)
  }

  // Get all images for gallery
  const galleryImages = resort?.images && resort.images.length > 0 
    ? resort.images 
    : (resort?.image ? [resort.image] : [])

  const roomTypes = resort?.roomTypes && resort.roomTypes.length > 0 ? resort.roomTypes : []
  const activeRoom = roomTypes.find((r) => r.name === selectedRoomType) || roomTypes[0]
  const displayedPrice = activeRoom?.price || resort?.price || "Contact for pricing"
  const activeRoomImage = activeRoom?.image?.trim() || ""

  // Pause auto-scroll on user interaction
  const handleUserInteraction = useCallback(() => {
    setIsAutoScrolling(false)
    // Resume auto-scroll after 10 seconds of no interaction
    setTimeout(() => setIsAutoScrolling(true), 10000)
  }, [])

  // Auto-scroll images every 5 seconds
  useEffect(() => {
    if (!resort || galleryImages.length <= 1 || !isAutoScrolling) return

    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [resort, galleryImages.length, isAutoScrolling])

  // Keyboard navigation
  useEffect(() => {
    if (!resort || galleryImages.length <= 1) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleUserInteraction()
        setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleUserInteraction()
        setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [resort, galleryImages.length, handleUserInteraction])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-32">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading resort details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !resort) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-32">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Resort Not Found</h2>
            <p className="text-muted-foreground mb-6">{error || "The resort you're looking for doesn't exist."}</p>
            <Link href="/resorts">
              <Button className="rounded-full">
                Back to Resorts
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/resorts" className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Resorts
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">{resort.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

          <section className="space-y-8">
            {/* Hero Section with Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden bg-card border border-border"
            >
              {/* Main Image Display Area (70-75% height) */}
              <div className="relative w-full h-[320px] sm:h-[520px] lg:h-[70vh] sm:min-h-[500px]">
                {galleryImages.length > 0 && (
                  <>
                    <Image
                      key={selectedImageIndex} // Force re-render on change
                      src={galleryImages[selectedImageIndex] || "/placeholder.svg"}
                      alt={`${resort.title} - Image ${selectedImageIndex + 1}`}
                      fill
                      className="object-cover transition-opacity duration-500"
                      priority={selectedImageIndex === 0}
                    />
                    
                    {/* Navigation Arrows */}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 z-20"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 z-20"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </>
                    )}

                    {/* Gallery Icon */}
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-20">
                      <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip - Always show if there are images */}
              {galleryImages.length > 0 && (
                <div className="relative bg-background/95 backdrop-blur-sm border-t border-border p-3 sm:p-4 min-h-[120px] sm:min-h-[140px] z-30">
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scroll-smooth hide-scrollbar">
                    {galleryImages.map((src, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`relative shrink-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                          selectedImageIndex === index
                            ? 'border-primary scale-105 shadow-lg shadow-primary/30 opacity-100'
                            : 'border-border/50 hover:border-border/80 opacity-70 hover:opacity-100'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <Image
                          src={src || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-primary/20 ring-2 ring-primary/50" />
                        )}
                      </button>
                    ))}
                  </div>
                  {/* Auto-scroll indicator */}
                  {galleryImages.length > 1 && isAutoScrolling && (
                    <div className="absolute top-2 right-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span>Auto-scrolling</span>
                    </div>
                  )}
                </div>
              )}

              {/* Overlay with Resort Info - Positioned above thumbnails */}
              <div 
                className="absolute left-0 right-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent p-4 sm:p-8 pointer-events-none z-10 bottom-[120px]"
              >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pointer-events-auto">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{resort.location}</span>
                      {resort.featured && (
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full border border-primary/30">
                          Featured
                        </span>
                      )}
                      {resort.popular && (
                        <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full border border-accent/30">
                          Popular
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white">{resort.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-white font-semibold">{resort.rating}</span>
                        <span>(4.5 rating)</span>
                      </div>
                      {resort.type && (
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            resort.type === 'international' 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {resort.type === 'international' ? 'International' : 'Domestic'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Starting from</p>
                      <p className="text-2xl sm:text-4xl font-bold text-primary">{displayedPrice}</p>
                      <p className="text-xs text-muted-foreground mt-1">Per night</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleWhatsApp}
                        className="bg-primary hover:bg-primary/90 text-white rounded-full px-5 sm:px-6"
                      >
                        Book Now
                      </Button>
                      <Button
                        onClick={handleWhatsApp}
                        variant="outline"
                        size="icon"
                        className="rounded-full border-primary text-primary hover:bg-primary/10"
                        aria-label="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Room Types */}
            {roomTypes.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Rooms</h2>
                    <p className="text-sm text-muted-foreground">
                      Explore room types with images, pricing and amenities.
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Selected:{" "}
                    <span className="text-white font-semibold">
                      {selectedRoomType || roomTypes[0]?.name}
                    </span>
                  </div>
                </div>

                <div className="space-y-10">
                  {roomTypes.map((rt, index) => {
                    const selected = (selectedRoomType || roomTypes[0]?.name) === rt.name
                    const roomImageSrc =
                      rt.image?.trim() || galleryImages[0] || resort.image || "/placeholder.svg"
                    const expanded = expandedRoomType === rt.name
                    const roomDescription =
                      rt.description?.trim() ||
                      (rt.amenities?.length
                        ? `Includes: ${rt.amenities.slice(0, 6).join(", ")}${rt.amenities.length > 6 ? "..." : ""}`
                        : "Comfortable stay with premium in-room features.")

                    return (
                      <div
                        key={rt.name}
                        className={`overflow-hidden rounded-3xl border ${
                          selected ? "border-primary/60 shadow-lg shadow-primary/10" : "border-border"
                        } bg-card`}
                      >
                        {/* Mobile layout */}
                        <div className="lg:hidden p-5">
                          <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                            <div>
                              <div
                                className="relative w-full h-[120px] rounded-2xl overflow-hidden border border-border bg-muted/20"
                                onClick={() => setSelectedRoomType(rt.name)}
                                role="button"
                                tabIndex={0}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={roomImageSrc}
                                  alt={`${rt.name} room image`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                                  }}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm px-2 py-1.5">
                                  <p className="text-xs font-semibold text-white truncate">{rt.name}</p>
                                </div>
                              </div>

                              <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-4">
                                {roomDescription}
                              </p>

                              <div className="mt-2">
                                <p className="text-[11px] text-muted-foreground">Per night</p>
                                <p className="text-sm font-bold text-primary">{rt.price || resort.price}</p>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <p className="text-xs font-semibold text-white">Room amenities</p>
                                {rt.amenities?.length > 4 ? (
                                  <button
                                    type="button"
                                    className="text-xs text-primary underline underline-offset-4"
                                    onClick={() =>
                                      setExpandedRoomType((prev) => (prev === rt.name ? null : rt.name))
                                    }
                                  >
                                    {expanded ? "Less" : "More"}
                                  </button>
                                ) : null}
                              </div>

                              {rt.amenities?.length ? (
                                <div className="space-y-2">
                                  {(expanded ? rt.amenities : rt.amenities.slice(0, 4)).map((amenity, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-2 rounded-xl border border-primary/12 bg-primary/5 px-3 py-2 text-xs text-muted-foreground"
                                    >
                                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                      <span className="leading-snug">{amenity}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  No amenities added for this room type.
                                </p>
                              )}

                              <div className="mt-4 flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => setSelectedRoomType(rt.name)}
                                  className={`rounded-full ${
                                    selected
                                      ? "bg-primary hover:bg-primary/90"
                                      : "bg-primary/20 hover:bg-primary/25 text-white border border-primary/30"
                                  }`}
                                  variant={selected ? "default" : "secondary"}
                                >
                                  {selected ? "Selected" : "Select"}
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRoomType(rt.name)
                                    handleWhatsApp()
                                  }}
                                  className="rounded-full bg-primary hover:bg-primary/90"
                                >
                                  Book
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Desktop layout */}
                        <div
                          className={`hidden lg:flex ${
                            index % 2 === 1 ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          {/* Text Panel */}
                          <div className="flex-1 p-12 flex flex-col justify-center">
                            <div className="flex items-start justify-between gap-6">
                              <div>
                                <h3 className="text-4xl font-semibold text-white">{rt.name}</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                                  {roomDescription}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Per night</p>
                                <p className="text-2xl font-bold text-primary">
                                  {rt.price || resort.price}
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 flex items-center gap-3">
                              <Button
                                type="button"
                                onClick={() => setSelectedRoomType(rt.name)}
                                className={`rounded-full ${
                                  selected
                                    ? "bg-primary hover:bg-primary/90"
                                    : "bg-primary/20 hover:bg-primary/25 text-white border border-primary/30"
                                }`}
                                variant={selected ? "default" : "secondary"}
                              >
                                {selected ? "Selected" : "Select this room"}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setExpandedRoomType((prev) => (prev === rt.name ? null : rt.name))}
                                className="rounded-full"
                              >
                                {expanded ? "Hide details" : "More →"}
                              </Button>
                              <Button
                                type="button"
                                onClick={() => {
                                  setSelectedRoomType(rt.name)
                                  handleWhatsApp()
                                }}
                                className="rounded-full bg-primary hover:bg-primary/90"
                              >
                                Book Now
                              </Button>
                            </div>

                            {expanded && (
                              <div className="mt-6">
                                <h4 className="text-sm font-semibold text-white mb-3">Room Amenities</h4>
                                {rt.amenities?.length ? (
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    {rt.amenities.map((amenity, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-muted-foreground"
                                      >
                                        <Check className="h-4 w-4 text-primary shrink-0" />
                                        <span>{amenity}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    No room amenities specified for this room type.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Image Panel */}
                          <div className="w-[48%] bg-background/20 p-8">
                            <div className="rounded-2xl overflow-hidden border border-border bg-muted/20">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={roomImageSrc}
                                alt={`${rt.name} room image`}
                                className="w-full h-[420px] object-cover"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.section>
            )}

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              {/* Left Column - Main Content */}
              <div className="space-y-8">
                {/* Overview */}
                {resort.description && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4"
                  >
                    <h2 className="text-2xl font-bold text-white">Overview</h2>
                    <p className="text-muted-foreground leading-relaxed">{resort.description}</p>
                    {resort.addressTile && (
                      <div className="flex items-start gap-2 pt-2">
                        <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{resort.addressTile}</p>
                      </div>
                    )}
                  </motion.section>
                )}

                {/* Activities */}
                {resort.activities && resort.activities.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-card border border-border rounded-3xl p-6 sm:p-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-4">Activities</h2>
                    <div className="flex flex-wrap gap-2">
                      {resort.activities.map((activity, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          {activity}
                        </span>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Amenities */}
                {resort.amenities && resort.amenities.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-card border border-border rounded-3xl p-6 sm:p-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {resort.amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-muted-foreground"
                        >
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Additional Info */}
                {(resort.mood || resort.tags) && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4"
                  >
                    {resort.mood && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Mood</h3>
                        <p className="text-muted-foreground">{resort.mood}</p>
                      </div>
                    )}
                    {resort.tags && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {resort.tags.split(',').map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.section>
                )}
              </div>

              {/* Right Column - Sticky Price Card */}
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:sticky lg:top-28 h-fit"
              >
                <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Starting from</p>
                      <p className="text-2xl font-bold text-primary mt-1">{resort.price}</p>
                      <p className="text-xs text-muted-foreground mt-1">Per night</p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 border border-border">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="text-sm font-semibold text-white">{resort.rating}</span>
                    </div>
                  </div>
                  
                  {resort.amenities && resort.amenities.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-semibold text-white">Key Amenities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {resort.amenities.slice(0, 6).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={handleWhatsApp}
                      className="w-full rounded-full bg-primary hover:bg-primary/90 text-white"
                      size="lg"
                    >
                      Book This Resort
                    </Button>
                    <Button
                      onClick={handleWhatsApp}
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary/10"
                      size="lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat on WhatsApp
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-2">
                    No hidden charges. Customized quotes available on request.
                  </p>
                </div>
              </motion.aside>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
