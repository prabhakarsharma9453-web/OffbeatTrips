"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, Star, Sparkles, Search, Filter, Crown, TrendingUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const luxuryQuotes = [
  "Luxury is not a place, it's an experience.",
  "Elegance is the only beauty that never fades.",
  "True luxury is being able to own your time.",
  "Luxury must be comfortable, otherwise it is not luxury.",
  "The best luxury is the luxury of being yourself.",
]

const locations = [
  "All Locations",
  "Maldives",
  "Switzerland",
  "Greece",
  "UAE",
  "Indonesia",
  "Rajasthan, India",
  "Goa, India",
  "Himachal Pradesh",
  "Kerala, India",
  "Uttarakhand",
]

const allResorts = [
  {
    id: 1,
    title: "The Maldives Paradise Resort",
    location: "Maldives",
    price: "$899/night",
    rating: 4.9,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    amenities: ["Private Villa", "Infinity Pool", "Spa", "Beach Access"],
    featured: true,
    popular: true,
  },
  {
    id: 2,
    title: "Swiss Alpine Luxury Lodge",
    location: "Switzerland",
    price: "$1,299/night",
    rating: 4.8,
    image: "/swiss-alps-mountains-snow-travel.jpg",
    amenities: ["Mountain View", "Ski Access", "Fine Dining", "Spa"],
    featured: true,
    popular: false,
  },
  {
    id: 3,
    title: "Santorini Cliffside Resort",
    location: "Greece",
    price: "$799/night",
    rating: 4.9,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    amenities: ["Sunset Views", "Infinity Pool", "Wine Cellar", "Private Beach"],
    featured: false,
    popular: true,
  },
  {
    id: 4,
    title: "Dubai Desert Oasis",
    location: "UAE",
    price: "$1,499/night",
    rating: 4.8,
    image: "/beautiful-waterfall-nature-hiking.jpg",
    amenities: ["Desert Views", "Private Pool", "Butler Service", "Spa"],
    featured: true,
    popular: true,
  },
  {
    id: 5,
    title: "Bali Tropical Retreat",
    location: "Indonesia",
    price: "$699/night",
    rating: 4.9,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    amenities: ["Villa Suite", "Private Beach", "Yoga Studio", "Spa"],
    featured: false,
    popular: true,
  },
  {
    id: 6,
    title: "Rajasthan Palace Heritage",
    location: "Rajasthan, India",
    price: "₹25,999/night",
    rating: 4.9,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    amenities: ["Heritage Room", "Palace Tour", "Cultural Shows", "Spa"],
    featured: true,
    popular: true,
  },
  {
    id: 7,
    title: "Goa Beachfront Luxury",
    location: "Goa, India",
    price: "₹18,999/night",
    rating: 4.8,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    amenities: ["Beach Villa", "Infinity Pool", "Water Sports", "Spa"],
    featured: false,
    popular: true,
  },
  {
    id: 8,
    title: "Himalayan Mountain Resort",
    location: "Himachal Pradesh",
    price: "₹22,999/night",
    rating: 4.9,
    image: "/manali-mountains-snow-adventure-himachal.jpg",
    amenities: ["Mountain View", "Adventure Activities", "Wellness Center", "Fine Dining"],
    featured: true,
    popular: false,
  },
  {
    id: 9,
    title: "Kerala Backwaters Luxury",
    location: "Kerala, India",
    price: "₹19,999/night",
    rating: 4.8,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    amenities: ["Houseboat Suite", "Ayurveda Spa", "Private Chef", "Yoga"],
    featured: false,
    popular: true,
  },
  {
    id: 10,
    title: "Rishikesh Riverside Resort",
    location: "Uttarakhand",
    price: "₹15,999/night",
    rating: 4.7,
    image: "/beautiful-waterfall-nature-hiking.jpg",
    amenities: ["River View", "Meditation Hall", "Adventure Sports", "Spa"],
    featured: false,
    popular: false,
  },
  {
    id: 11,
    title: "Tuscany Vineyard Estate",
    location: "Italy",
    price: "$1,199/night",
    rating: 4.9,
    image: "/swiss-alps-mountains-snow-travel.jpg",
    amenities: ["Wine Tasting", "Private Vineyard", "Gourmet Dining", "Spa"],
    featured: true,
    popular: true,
  },
  {
    id: 12,
    title: "Tokyo Skyline Luxury",
    location: "Japan",
    price: "$1,099/night",
    rating: 4.8,
    image: "/norway-fjords-beautiful-water-mountains.jpg",
    amenities: ["City Views", "Fine Dining", "Traditional Spa", "Concierge"],
    featured: false,
    popular: true,
  },
]

export default function AllResortsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"popular" | "featured" | "rating" | "price">("popular")
  const sectionRef = useRef<HTMLElement>(null)
  const [currentQuote, setCurrentQuote] = useState(luxuryQuotes[0])

  useEffect(() => {
    setIsVisible(true)
    const quoteInterval = setInterval(() => {
      setCurrentQuote(luxuryQuotes[Math.floor(Math.random() * luxuryQuotes.length)])
    }, 5000)
    return () => clearInterval(quoteInterval)
  }, [])

  const filteredResorts = allResorts
    .filter((resort) => {
      const matchesLocation = selectedLocation === "All Locations" || resort.location === selectedLocation
      const matchesSearch = !searchQuery || resort.title.toLowerCase().includes(searchQuery.toLowerCase()) || resort.location.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesLocation && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        if (a.popular !== b.popular) return a.popular ? -1 : 1
        return b.rating - a.rating
      }
      if (sortBy === "featured") {
        if (a.featured !== b.featured) return a.featured ? -1 : 1
        return b.rating - a.rating
      }
      if (sortBy === "rating") {
        return b.rating - a.rating
      }
      return 0
    })

  const ResortCard = ({ resort, index }: { resort: (typeof allResorts)[0]; index: number }) => (
    <div
      className={`group relative bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {resort.featured && (
        <div className="absolute top-3 left-3 z-20 bg-primary px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
          <Crown className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-medium">Featured</span>
        </div>
      )}
      {resort.popular && (
        <div className={`absolute top-3 ${resort.featured ? "right-3" : "left-3"} z-20 bg-accent px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md`}>
          <TrendingUp className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-medium">Popular</span>
        </div>
      )}
      <div className="relative h-56 overflow-hidden">
        <img
          src={resort.image || "/placeholder.svg"}
          alt={resort.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 z-10">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-white text-xs font-semibold">{resort.rating}</span>
        </div>
        <div className="absolute bottom-3 left-3 z-10">
          <div className="flex items-center gap-1.5 text-white">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{resort.location}</span>
          </div>
        </div>
      </div>
      <div className="p-5 bg-card">
        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary transition-colors line-clamp-1">
          {resort.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {resort.amenities.slice(0, 4).map((amenity, idx) => (
            <span
              key={idx}
              className="text-xs bg-muted/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-muted-foreground border border-border/50"
            >
              {amenity}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xl font-bold text-primary">
              {resort.price}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Per night</p>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-5 py-2 text-sm transition-all duration-300 hover:scale-105"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <Navbar />
      <section ref={sectionRef} className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with Quote */}
          <div className={`text-center mb-8 sm:mb-12 lg:mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 px-6 py-3 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-semibold">Luxury Resorts Collection</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              World's Most <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Luxurious Resorts</span>
            </h1>
            <div className="max-w-3xl mx-auto relative">
              <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-8 md:p-10 shadow-2xl">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl text-white/95 font-medium italic transition-all duration-500">
                  &ldquo;{currentQuote}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={`mb-8 sm:mb-10 lg:mb-10 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "200ms" }}>
            <div className="bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-xl">
              <div className="relative mb-6">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search resorts by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-14 bg-background/60 border-border/50 rounded-full text-white placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Location Filter */}
                <div>
                  <label className="text-sm font-semibold text-white mb-4 block flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    Filter by Location
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedLocation === location
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/40 scale-105"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted/80 hover:text-white border border-border/50"
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="text-sm font-semibold text-white mb-4 block flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Sort By
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "popular", label: "Most Popular" },
                      { value: "featured", label: "Featured" },
                      { value: "rating", label: "Highest Rated" },
                      { value: "price", label: "Price" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as typeof sortBy)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                          sortBy === option.value
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/40 scale-105"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted/80 hover:text-white border border-border/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8 text-center">
            <p className="text-muted-foreground text-lg">
              Discover <span className="text-primary font-bold text-xl">{filteredResorts.length}</span> luxury resorts
            </p>
          </div>

          {/* Resorts Grid */}
          {filteredResorts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredResorts.map((resort, index) => (
                <ResortCard key={resort.id} resort={resort} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No resorts found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSelectedLocation("All Locations")
                  setSearchQuery("")
                }}
                variant="outline"
                className="mt-4 rounded-full"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
