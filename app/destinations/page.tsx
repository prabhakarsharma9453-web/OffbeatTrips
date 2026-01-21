"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, ArrowRight } from "lucide-react"

export default function AllDestinationsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "international" | "domestic">("all")
  const [destinations, setDestinations] = useState<
    { id: string; name: string; country: string; trips: number; image: string; slug: string }[]
  >([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Load destinations from database
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/destinations")
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setDestinations(json.data)
        } else {
          setDestinations([])
        }
      } catch (error) {
        console.error("Error loading destinations:", error)
        setDestinations([])
      }
    }
    load()
  }, [])

  const withType = destinations.map((d) => {
    const isDomestic = String(d.country || "").toLowerCase().includes("india")
    return { ...d, type: isDomestic ? "domestic" : "international" as "domestic" | "international" }
  })

  const filteredDestinations =
    activeTab === "all"
      ? withType
      : activeTab === "international"
        ? withType.filter((dest) => dest.type === "international")
        : withType.filter((dest) => dest.type === "domestic")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section ref={sectionRef} className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              All <span className="text-primary">Destinations</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Explore all our popular destinations and discover amazing trips in each location
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-muted rounded-full p-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "all"
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                All Destinations
              </button>
              <button
                onClick={() => setActiveTab("international")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "international"
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                International
              </button>
              <button
                onClick={() => setActiveTab("domestic")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "domestic"
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                Domestic
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8 text-center">
            <p className="text-muted-foreground">
              Showing <span className="text-primary font-semibold">{filteredDestinations.length}</span> destinations
            </p>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDestinations.map((destination: any, index: number) => (
              <Link
                key={destination.id}
                href={`/trips/${destination.slug}`}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer block ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-64">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                      <MapPin className="w-3 h-3" />
                      {destination.country}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{destination.name}</h3>
                    <p className="text-white/80 text-sm font-medium">{destination.trips} Trips Available</p>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
