"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, MapPin, Clock, Star, CheckCircle2, XCircle } from "lucide-react"

type TripDetail = {
  id: string
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
}

export default function DestinationTripDetailsPage() {
  const params = useParams()
  const location = params?.location as string
  const slug = params?.slug as string

  const [isLoading, setIsLoading] = useState(true)
  const [trip, setTrip] = useState<TripDetail | null>(null)
  const [error, setError] = useState<string>("")

  // gallery
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const userInteractedRef = useRef(false)

  const images = useMemo(() => {
    if (!trip) return []
    const list = Array.isArray(trip.images) && trip.images.length > 0 ? trip.images : (trip.image ? [trip.image] : [])
    return list.filter(Boolean)
  }, [trip])

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        setError("")
        const res = await fetch(`/api/destination-trips/${encodeURIComponent(slug)}`)
        const json = await res.json()
        if (res.ok && json?.success) {
          setTrip(json.data)
          setActiveIndex(0)
        } else {
          setTrip(null)
          setError(json?.error || `Failed to fetch trip (${res.status})`)
        }
      } catch (e) {
        setTrip(null)
        setError("Failed to fetch trip")
      } finally {
        setIsLoading(false)
      }
    }
    if (slug) load()
  }, [slug])

  useEffect(() => {
    if (!autoPlay) return
    if (images.length <= 1) return
    if (userInteractedRef.current) return

    const t = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length)
    }, 3500)

    return () => clearInterval(t)
  }, [autoPlay, images.length])

  const locationDisplayName = useMemo(() => {
    return location
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }, [location])

  const handleUserInteraction = () => {
    userInteractedRef.current = true
    setAutoPlay(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href={`/trips/${location}`}>
              <Button variant="ghost" className="text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {locationDisplayName} trips
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <p className="text-destructive font-medium">{error}</p>
              <p className="text-muted-foreground mt-2">Please go back and try another trip.</p>
            </div>
          ) : !trip ? null : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Gallery */}
              <div className="lg:col-span-7">
                <div className="bg-card border border-border rounded-3xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={images[activeIndex] || "/placeholder.svg"}
                      alt={trip.title}
                      className="w-full h-[340px] sm:h-[440px] object-cover"
                      onMouseDown={handleUserInteraction}
                      onTouchStart={handleUserInteraction}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <Badge className="bg-black/60 text-white border-white/10 capitalize">{trip.type}</Badge>
                      {trip.mood ? <Badge className="bg-primary/20 text-primary border-primary/20">{trip.mood}</Badge> : null}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-white text-sm font-semibold">{trip.rating}</span>
                    </div>
                  </div>

                  {images.length > 1 ? (
                    <div className="p-4 border-t border-border">
                      <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
                        {images.map((img, idx) => (
                          <button
                            key={`${img}-${idx}`}
                            type="button"
                            onClick={() => {
                              handleUserInteraction()
                              setActiveIndex(idx)
                            }}
                            className={`shrink-0 rounded-xl overflow-hidden border transition-all ${
                              idx === activeIndex ? "border-primary" : "border-border hover:border-primary/60"
                            }`}
                            aria-label={`View image ${idx + 1}`}
                            title={`View image ${idx + 1}`}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-20 h-16 object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {userInteractedRef.current ? "Auto-scroll paused" : "Auto-scrolling images"}
                        </p>
                        {userInteractedRef.current ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              userInteractedRef.current = false
                              setAutoPlay(true)
                            }}
                          >
                            Resume
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-5">
                <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">{trip.title}</h1>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{trip.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{trip.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-3xl font-bold text-primary">{trip.price}</p>
                      <p className="text-xs text-muted-foreground">per person</p>
                    </div>
                    <Link href="/#contact">
                      <Button className="bg-primary hover:bg-primary/90 rounded-full px-6">
                        Enquire Now
                      </Button>
                    </Link>
                  </div>

                  {trip.description ? (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-white mb-2">What we provide</h2>
                      <p className="text-muted-foreground whitespace-pre-line">{trip.description}</p>
                    </div>
                  ) : null}

                  {trip.highlights?.length ? (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-white mb-2">Highlights</h2>
                      <ul className="space-y-2">
                        {trip.highlights.map((h, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {trip.activities?.length ? (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-white mb-2">Activities</h2>
                      <div className="flex flex-wrap gap-2">
                        {trip.activities.map((a, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-muted/60 text-muted-foreground border-border">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {(trip.inclusions?.length || trip.exclusions?.length) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h2 className="text-lg font-semibold text-white mb-2">Inclusions</h2>
                        {trip.inclusions?.length ? (
                          <ul className="space-y-2">
                            {trip.inclusions.map((x, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                                <span>{x}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not specified</p>
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white mb-2">Exclusions</h2>
                        {trip.exclusions?.length ? (
                          <ul className="space-y-2">
                            {trip.exclusions.map((x, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <XCircle className="w-4 h-4 text-destructive mt-0.5" />
                                <span>{x}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not specified</p>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

