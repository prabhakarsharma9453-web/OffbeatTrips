"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, Clock, Star, ArrowRight, Loader2, Package, Hotel } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Destination {
  id: string
  name: string
  country: string
  trips: number
  image: string
  slug: string
}

interface PackageItem {
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
  highlights: string[]
  activities: string[]
  type: 'domestic' | 'international'
}

interface ResortItem {
  id: string
  title: string
  location: string
  name?: string
  price: string
  rating: number
  image: string
  amenities: string[]
  featured?: boolean
  popular?: boolean
  type?: 'domestic' | 'international'
}

export default function DestinationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [destination, setDestination] = useState<Destination | null>(null)
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [resorts, setResorts] = useState<ResortItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPackages, setIsLoadingPackages] = useState(true)
  const [isLoadingResorts, setIsLoadingResorts] = useState(true)

  // Fetch destination by slug
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await fetch("/api/destinations")
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          const found = json.data.find((d: Destination) => d.slug === slug)
          if (found) {
            setDestination(found)
          } else {
            router.push("/destinations")
          }
        }
      } catch (error) {
        console.error("Error fetching destination:", error)
        router.push("/destinations")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchDestination()
    }
  }, [slug, router])

  // Fetch packages filtered by location
  useEffect(() => {
    const fetchPackages = async () => {
      if (!destination) return

      try {
        setIsLoadingPackages(true)
        // Try filtering by destination name first
        let res = await fetch(`/api/packages?location=${encodeURIComponent(destination.name)}`)
        let json = await res.json()
        
        let filteredPackages: PackageItem[] = []
        
        if (json.success && Array.isArray(json.data)) {
          filteredPackages = json.data
        } else {
          // If no results, fetch all and filter client-side
          res = await fetch("/api/packages")
          json = await res.json()
          
          if (json.success && Array.isArray(json.data)) {
            const destinationNameLower = destination.name.toLowerCase()
            const destinationCountryLower = destination.country.toLowerCase()
            
            filteredPackages = json.data.filter((pkg: PackageItem) => {
              const pkgLocationLower = (pkg.location || "").toLowerCase()
              const pkgCountryLower = (pkg.country || "").toLowerCase()
              
              return (
                pkgLocationLower.includes(destinationNameLower) ||
                pkgLocationLower.includes(destinationCountryLower) ||
                pkgCountryLower.includes(destinationNameLower) ||
                pkgCountryLower.includes(destinationCountryLower) ||
                destinationNameLower.includes(pkgLocationLower) ||
                destinationCountryLower.includes(pkgCountryLower)
              )
            })
          }
        }
        
        setPackages(filteredPackages)
      } catch (error) {
        console.error("Error fetching packages:", error)
        setPackages([])
      } finally {
        setIsLoadingPackages(false)
      }
    }

    fetchPackages()
  }, [destination])

  // Fetch resorts filtered by location (using name field from resort form)
  useEffect(() => {
    const fetchResorts = async () => {
      if (!destination) return

      try {
        setIsLoadingResorts(true)
        const destinationNameLower = destination.name.toLowerCase()
        const destinationCountryLower = destination.country.toLowerCase()
        
        // Try filtering by destination name first
        let res = await fetch(`/api/resorts?location=${encodeURIComponent(destination.name)}`)
        let json = await res.json()
        
        let filteredResorts: ResortItem[] = []
        
        if (json.success && Array.isArray(json.data)) {
          filteredResorts = json.data
        } else {
          // If no results, fetch all and filter client-side using name field
          res = await fetch("/api/resorts")
          json = await res.json()
          
          if (json.success && Array.isArray(json.data)) {
            filteredResorts = json.data.filter((resort: ResortItem) => {
              // Use name field (first field in resort form) for matching
              const resortNameLower = (resort.name || resort.location || "").toLowerCase()
              const resortLocationLower = (resort.location || "").toLowerCase()
              
              return (
                resortNameLower.includes(destinationNameLower) ||
                resortNameLower.includes(destinationCountryLower) ||
                resortLocationLower.includes(destinationNameLower) ||
                resortLocationLower.includes(destinationCountryLower) ||
                destinationNameLower.includes(resortNameLower) ||
                destinationCountryLower.includes(resortNameLower) ||
                destinationNameLower.includes(resortLocationLower) ||
                destinationCountryLower.includes(resortLocationLower)
              )
            })
          }
        }
        
        setResorts(filteredResorts)
      } catch (error) {
        console.error("Error fetching resorts:", error)
        setResorts([])
      } finally {
        setIsLoadingResorts(false)
      }
    }

    fetchResorts()
  }, [destination])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!destination) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden mb-12">
            <img
              src={destination.image || "/placeholder.svg"}
              alt={destination.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                <MapPin className="w-5 h-5" />
                {destination.country}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                {destination.name}
              </h1>
              <p className="text-white/80 text-lg">
                {destination.trips} {destination.trips === 1 ? "Trip" : "Trips"} Available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                Packages in {destination.name}
              </h2>
              <p className="text-muted-foreground">
                Discover amazing travel packages for {destination.name}
              </p>
            </div>
          </div>

          {isLoadingPackages ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug}`}
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.image || "/placeholder.svg"}
                      alt={pkg.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-white text-sm font-medium">{pkg.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      {pkg.location}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Clock className="w-4 h-4" />
                        {pkg.duration}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 rounded-full px-4"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-lg">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No packages found for {destination.name}
              </p>
              <Link href="/packages">
                <Button variant="outline" className="mt-4">
                  Browse All Packages
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Resorts Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Hotel className="w-8 h-8 text-primary" />
                Resorts in {destination.name}
              </h2>
              <p className="text-muted-foreground">
                Experience luxury stays in {destination.name}
              </p>
            </div>
          </div>

          {isLoadingResorts ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : resorts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resorts.map((resort) => (
                <Link
                  key={resort.id}
                  href={`/resorts/${resort.id}`}
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={resort.image || "/placeholder.svg"}
                      alt={resort.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-white text-sm font-medium">{resort.rating}</span>
                    </div>
                    {resort.featured && (
                      <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      {resort.location}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {resort.title}
                    </h3>
                    {resort.amenities && resort.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resort.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-muted/50 px-2 py-1 rounded-full text-muted-foreground"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-2xl font-bold text-primary">{resort.price}</p>
                        <p className="text-xs text-muted-foreground">per night</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 rounded-full px-4"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-lg">
              <Hotel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No resorts found for {destination.name}
              </p>
              <Link href="/resorts">
                <Button variant="outline" className="mt-4">
                  Browse All Resorts
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
