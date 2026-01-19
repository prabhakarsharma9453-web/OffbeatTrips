"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, Clock, Star, ArrowRight, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type DestinationTripItem = {
  id: string
  slug: string
  title: string
  location: string
  duration: string
  price: string
  rating: number
  image: string
  highlights: string[]
  mood: string
  activities: string[]
  type: "domestic" | "international"
}

export default function DestinationTripsPage() {
  const params = useParams()
  const locationName = params?.location as string
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [trips, setTrips] = useState<DestinationTripItem[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Destination slug comes directly from URL: /trips/[location]
  const destinationSlug = locationName
  const locationDisplayName = destinationSlug
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/destination-trips?destination=${encodeURIComponent(destinationSlug)}`)
        const json = await res.json()
        if (json.success) {
          setTrips(json.data || [])
        } else {
          setTrips([])
        }
      } catch {
        setTrips([])
      } finally {
        setIsLoading(false)
      }
    }
    if (destinationSlug) load()
  }, [destinationSlug])

  const filteredTrips = trips.filter(
    (trip) =>
      !searchQuery ||
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const TripCard = ({ trip }: { trip: (typeof trips)[0] }) => (
    <div className="group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
      <div className="relative h-64 overflow-hidden">
        <img
          src={trip.image || "/placeholder.svg"}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-white text-sm font-semibold">{trip.rating}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            {trip.location}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{trip.title}</h3>
          <div className="flex flex-wrap gap-2">
            {trip.highlights.slice(0, 3).map((highlight, idx) => (
              <span key={idx} className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="w-4 h-4" />
            {trip.duration}
          </div>
          {trip.mood ? (
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{trip.mood}</span>
          ) : (
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium capitalize">
              {trip.type}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {trip.activities.slice(0, 3).map((activity, idx) => (
            <span key={idx} className="text-xs bg-muted/80 backdrop-blur-sm px-3 py-1 rounded-full text-muted-foreground border border-border/50">
              {activity}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-2xl font-bold text-primary">{trip.price}</p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          <Link href={`/trips/${destinationSlug}/${trip.slug}`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 rounded-full px-6 transition-all duration-300 hover:scale-105"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section ref={sectionRef} className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              {locationDisplayName} <span className="text-primary">Trips</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Discover {filteredTrips.length} amazing trips available in {locationDisplayName}
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-card border-border rounded-full text-white placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8 text-center">
            <p className="text-muted-foreground">
              Showing <span className="text-primary font-semibold">{filteredTrips.length}</span> of {trips.length} trips
            </p>
          </div>

          {/* Trips Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredTrips.map((trip, index) => (
                <div
                  key={trip.id}
                  className={isVisible ? "animate-fade-in-up" : "opacity-0"}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No trips found for this destination. (Admin can add multiple trips under Admin → Destinations → Destination Trips)
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
