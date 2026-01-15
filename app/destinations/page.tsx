"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, ArrowRight } from "lucide-react"

const allDestinations = [
  {
    id: 1,
    name: "Switzerland",
    country: "Europe",
    trips: 12,
    image: "/switzerland-alps-beautiful-scenery.jpg",
    slug: "Switzerland",
    type: "international",
  },
  {
    id: 2,
    name: "Norway",
    country: "Europe",
    trips: 8,
    image: "/norway-fjords-beautiful-water-mountains.jpg",
    slug: "Norway",
    type: "international",
  },
  {
    id: 3,
    name: "Ladakh",
    country: "India",
    trips: 15,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    slug: "Ladakh",
    type: "domestic",
  },
  {
    id: 4,
    name: "Thailand",
    country: "Asia",
    trips: 10,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    slug: "Thailand",
    type: "international",
  },
  {
    id: 5,
    name: "New Zealand",
    country: "Oceania",
    trips: 9,
    image: "/new-zealand-mountains-nature-scenic.jpg",
    slug: "New-Zealand",
    type: "international",
  },
  {
    id: 6,
    name: "Manali",
    country: "India",
    trips: 18,
    image: "/manali-mountains-snow-adventure-himachal.jpg",
    slug: "Manali",
    type: "domestic",
  },
  {
    id: 7,
    name: "France",
    country: "Europe",
    trips: 14,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    slug: "France",
    type: "international",
  },
  {
    id: 8,
    name: "Maldives",
    country: "Asia",
    trips: 11,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    slug: "Maldives",
    type: "international",
  },
  {
    id: 9,
    name: "Kerala",
    country: "India",
    trips: 16,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    slug: "Kerala",
    type: "domestic",
  },
  {
    id: 10,
    name: "Goa",
    country: "India",
    trips: 13,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    slug: "Goa",
    type: "domestic",
  },
  {
    id: 11,
    name: "Rajasthan",
    country: "India",
    trips: 12,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    slug: "Rajasthan",
    type: "domestic",
  },
  {
    id: 12,
    name: "Iceland",
    country: "Europe",
    trips: 9,
    image: "/norway-fjords-beautiful-water-mountains.jpg",
    slug: "Iceland",
    type: "international",
  },
]

export default function AllDestinationsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "international" | "domestic">("all")
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredDestinations =
    activeTab === "all"
      ? allDestinations
      : activeTab === "international"
        ? allDestinations.filter((dest) => dest.type === "international")
        : allDestinations.filter((dest) => dest.type === "domestic")

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
            {filteredDestinations.map((destination, index) => (
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
