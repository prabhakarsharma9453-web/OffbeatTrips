"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Clock, Star, Check, X, MessageCircle, Home, Package, PhoneCall, ChevronLeft, ChevronRight, Maximize2, Loader2 } from "lucide-react"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useParams, useRouter } from "next/navigation"

interface PackageDetails {
  id: string
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
  type: 'domestic' | 'international'
  overview: string
  itinerary: Array<{
    day: number
    title: string
    description: string
    activities?: string[]
    meals?: string[]
  }>
  inclusions: string[]
  exclusions: string[]
  whyChoose: string[]
  whatsappMessage: string
  metaDescription?: string
}

export default function PackageDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [pkg, setPkg] = useState<PackageDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [similarPackages, setSimilarPackages] = useState<PackageDetails[]>([])

  useEffect(() => {
    const fetchPackage = async () => {
      if (!slug) return

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/packages/${slug}`)
        const result = await response.json()

        if (result.success) {
          setPkg(result.data)
          setSelectedImageIndex(0)
          console.log('Package loaded with images:', {
            totalImages: result.data.images?.length || 0,
            images: result.data.images,
            mainImage: result.data.image
          })
          
          // Fetch similar packages (same type, different slug)
          if (result.data.type) {
            try {
              const similarResponse = await fetch(`/api/packages?type=${result.data.type}`)
              const similarResult = await similarResponse.json()
              if (similarResult.success) {
                // Filter out current package and limit to 4
                const similar = (similarResult.data || [])
                  .filter((p: PackageDetails) => p.slug !== result.data.slug)
                  .slice(0, 4)
                setSimilarPackages(similar)
              }
            } catch (err) {
              console.error('Error fetching similar packages:', err)
            }
          }
        } else {
          setError(result.error || 'Package not found')
        }
      } catch (err) {
        console.error('Error fetching package:', err)
        setError('Failed to load package details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackage()
  }, [slug])

  // Get all images for gallery
  const galleryImages = pkg?.images && pkg.images.length > 0 
    ? pkg.images 
    : (pkg?.image ? [pkg.image] : [])

  // Pause auto-scroll on user interaction
  const handleUserInteraction = useCallback(() => {
    setIsAutoScrolling(false)
    setTimeout(() => setIsAutoScrolling(true), 10000)
  }, [])

  // Auto-scroll images every 5 seconds
  useEffect(() => {
    if (!pkg || galleryImages.length <= 1 || !isAutoScrolling) return

    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [pkg, galleryImages.length, isAutoScrolling])

  // Keyboard navigation
  useEffect(() => {
    if (!pkg || galleryImages.length <= 1) return

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
  }, [pkg, galleryImages.length, handleUserInteraction])

  const handleNextImage = () => {
    if (!pkg || galleryImages.length === 0) return
    handleUserInteraction()
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const handlePreviousImage = () => {
    if (!pkg || galleryImages.length === 0) return
    handleUserInteraction()
    setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const handleThumbnailClick = (index: number) => {
    handleUserInteraction()
    setSelectedImageIndex(index)
  }

  const handleWhatsApp = () => {
    if (!pkg) return
    const message = encodeURIComponent(pkg.whatsappMessage || `Hi, I am interested in the ${pkg.title}`)
    window.open(`https://wa.me/918588855935?text=${message}`, "_blank", "noopener,noreferrer")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-32">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading package details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-32">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Package Not Found</h2>
            <p className="text-muted-foreground mb-6">{error || "The package you're looking for doesn't exist."}</p>
            <Link href="/packages">
              <Button className="rounded-full">
                Back to Packages
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
                  <BreadcrumbLink href="/packages" className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    Packages
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">{pkg.title}</BreadcrumbPage>
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
              <div className="relative w-full" style={{ height: '70vh', minHeight: '500px' }}>
                {galleryImages.length > 0 && (
                  <>
                    <Image
                      key={selectedImageIndex}
                      src={galleryImages[selectedImageIndex] || "/placeholder.svg"}
                      alt={`${pkg.title} - Image ${selectedImageIndex + 1}`}
                      fill
                      className="object-cover transition-opacity duration-500"
                      priority={selectedImageIndex === 0}
                    />
                    
                    {/* Navigation Arrows */}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 z-20"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 z-20"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* Gallery Icon */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-20">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip - Always show if there are images */}
              {galleryImages.length > 0 && (
                <div className="relative bg-background/95 backdrop-blur-sm border-t border-border p-4 min-h-[140px] z-30">
                  <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth hide-scrollbar">
                    {galleryImages.map((src, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
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

              {/* Overlay with Package Info - Positioned above thumbnails */}
              <div 
                className="absolute left-0 right-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent p-6 sm:p-8 pointer-events-none z-10" 
                style={{ bottom: galleryImages.length > 0 ? '140px' : '0' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pointer-events-auto">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{pkg.location}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{pkg.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-white font-semibold">{pkg.rating}</span>
                        <span>({pkg.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {pkg.highlights.slice(0, 3).map((highlight) => (
                        <span
                          key={highlight}
                          className="inline-flex items-center rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Starting from</p>
                      <p className="text-3xl sm:text-4xl font-bold text-primary">{pkg.price}/pp</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white rounded-full px-6"
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

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              {/* Left Column - Main Content */}
              <div className="space-y-8">
                {/* Overview */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4"
                >
                  <h2 className="text-2xl font-bold text-white">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">{pkg.overview || 'No overview available.'}</p>
                  {pkg.activities && pkg.activities.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {pkg.activities.map((activity, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.section>

                {/* Day-wise Itinerary */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card border border-border rounded-3xl p-6 sm:p-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Day-wise Itinerary</h2>
                  {pkg.itinerary && Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-3">
                      {pkg.itinerary.map((day, dayIdx) => (
                        <AccordionItem
                          key={day.day || dayIdx}
                          value={`day-${day.day || dayIdx + 1}`}
                          className="border border-border rounded-2xl px-4 bg-background/50"
                        >
                          <AccordionTrigger className="py-4 hover:no-underline">
                            <div className="flex items-start gap-4 text-left w-full">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shrink-0">
                                <span className="text-primary font-bold text-sm">Day {day.day || dayIdx + 1}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-base font-semibold text-white">{day.title || `Day ${day.day || dayIdx + 1}`}</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pl-14 space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">{day.description || 'No description available.'}</p>
                            {day.activities && Array.isArray(day.activities) && day.activities.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-white mb-2">Activities:</p>
                                <ul className="space-y-1">
                                  {day.activities.map((act, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                      <Check className="mt-0.5 h-3 w-3 text-primary shrink-0" />
                                      <span>{act}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {day.meals && Array.isArray(day.meals) && day.meals.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-white mb-2">Meals:</p>
                                <div className="flex flex-wrap gap-2">
                                  {day.meals.map((meal, idx) => (
                                    <span
                                      key={idx}
                                      className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                                    >
                                      {meal}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No itinerary available for this package.</p>
                    </div>
                  )}
                </motion.section>

                {/* Inclusions & Exclusions */}
                {((pkg.inclusions && pkg.inclusions.length > 0) || (pkg.exclusions && pkg.exclusions.length > 0)) && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    {pkg.inclusions && pkg.inclusions.length > 0 && (
                      <div className="bg-card border border-border rounded-3xl p-6 sm:p-7">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary" />
                          What's Included
                        </h2>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {pkg.inclusions.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pkg.exclusions && pkg.exclusions.length > 0 && (
                      <div className="bg-card border border-border rounded-3xl p-6 sm:p-7">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                          <X className="h-5 w-5 text-red-500" />
                          What's Not Included
                        </h2>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {pkg.exclusions.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <X className="mt-0.5 h-4 w-4 text-red-500 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.section>
                )}

                {/* Why Choose This Package */}
                {pkg.whyChoose && pkg.whyChoose.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-card border border-border rounded-3xl p-6 sm:p-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-4">Why Choose This Package</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {pkg.whyChoose.map((reason, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-muted-foreground"
                        >
                          {reason}
                        </div>
                      ))}
                    </div>
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
                      <p className="text-2xl font-bold text-primary mt-1">{pkg.price}/pp</p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 border border-border">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="text-sm font-semibold text-white">{pkg.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{pkg.duration}</span>
                  </div>
                  {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-semibold text-white">Highlights</p>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.highlights.map((h, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={() => setIsBookingOpen(true)}
                      className="w-full rounded-full bg-primary hover:bg-primary/90 text-white"
                      size="lg"
                    >
                      Book This Trip
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

            {/* Similar Packages */}
            {similarPackages.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Similar Packages</h2>
                  <Link href="/packages" className="text-sm text-primary hover:underline">
                    View all packages
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {similarPackages.map((sp) => (
                    <Link
                      key={sp.slug || sp.id}
                      href={`/packages/${sp.slug}`}
                      className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/60 transition-colors"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={sp.image || "/placeholder.svg"}
                          alt={sp.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                          <span className="font-semibold line-clamp-1">{sp.title}</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
                            <Star className="h-3 w-3 text-accent fill-accent" />
                            {sp.rating || 4.5}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {sp.location}
                        </p>
                        <p className="text-sm font-semibold text-primary">{sp.price}/pp</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </section>
        </div>
      </main>

      {/* Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request a Callback</DialogTitle>
            <DialogDescription>
              Share your details and our travel expert will get in touch to customize your{" "}
              <span className="font-semibold text-foreground">{pkg.title}</span> itinerary.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              We usually respond within a few minutes during working hours.
            </p>
          </div>
          <DialogFooter>
            <Button
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-white"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat on WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
