"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Search,
  Users,
  Calendar,
  DollarSign,
  Ship,
  Anchor,
  MapPin,
  Star,
  ChevronRight,
  Filter,
  X,
} from "lucide-react"

// Sample yacht data
const featuredYachts = [
  {
    id: 1,
    name: "Ocean Dream",
    length: 180,
    pricePerNight: 25000,
    homeport: "Maldives",
    flag: "🇲🇻",
    crew: 12,
    size: 180,
    destination: "Maldives",
    image: "/majestic-mountain-landscape-with-blue-sky-adventur.jpg",
  },
  {
    id: 2,
    name: "Aegean Majesty",
    length: 220,
    pricePerNight: 35000,
    homeport: "Greece",
    flag: "🇬🇷",
    crew: 16,
    size: 220,
    destination: "Greece",
    image: "/swiss-alps-mountains-snow-travel.jpg",
  },
  {
    id: 3,
    name: "Caribbean Queen",
    length: 150,
    pricePerNight: 20000,
    homeport: "Caribbean",
    flag: "🇧🇸",
    crew: 10,
    size: 150,
    destination: "Caribbean",
    image: "/camping-tent-nature-forest-night.jpg",
  },
  {
    id: 4,
    name: "Mediterranean Star",
    length: 200,
    pricePerNight: 30000,
    homeport: "French Riviera",
    flag: "🇫🇷",
    crew: 14,
    size: 200,
    destination: "Mediterranean",
    image: "/valley-hiking-adventure-green-mountains.jpg",
  },
  {
    id: 5,
    name: "Seychelles Explorer",
    length: 160,
    pricePerNight: 22000,
    homeport: "Seychelles",
    flag: "🇸🇨",
    crew: 11,
    size: 160,
    destination: "Seychelles",
    image: "/paragliding-flying-sky-adventure.jpg",
  },
  {
    id: 6,
    name: "Thai Paradise",
    length: 140,
    pricePerNight: 18000,
    homeport: "Thailand",
    flag: "🇹🇭",
    crew: 9,
    size: 140,
    destination: "Thailand",
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
  },
  {
    id: 7,
    name: "Croatian Gem",
    length: 170,
    pricePerNight: 24000,
    homeport: "Croatia",
    flag: "🇭🇷",
    crew: 12,
    size: 170,
    destination: "Croatia",
    image: "/majestic-mountain-landscape-with-blue-sky-adventur.jpg",
  },
  {
    id: 8,
    name: "Alaskan Adventure",
    length: 190,
    pricePerNight: 28000,
    homeport: "Alaska",
    flag: "🇺🇸",
    crew: 13,
    size: 190,
    destination: "Alaska",
    image: "/swiss-alps-mountains-snow-travel.jpg",
  },
  {
    id: 9,
    name: "Bahamas Bliss",
    length: 165,
    pricePerNight: 23000,
    homeport: "Bahamas",
    flag: "🇧🇸",
    crew: 11,
    size: 165,
    destination: "Bahamas",
    image: "/camping-tent-nature-forest-night.jpg",
  },
  {
    id: 10,
    name: "Greek Odyssey",
    length: 210,
    pricePerNight: 32000,
    homeport: "Greece",
    flag: "🇬🇷",
    crew: 15,
    size: 210,
    destination: "Greece",
    image: "/valley-hiking-adventure-green-mountains.jpg",
  },
  {
    id: 11,
    name: "Mediterranean Elite",
    length: 195,
    pricePerNight: 29000,
    homeport: "French Riviera",
    flag: "🇫🇷",
    crew: 14,
    size: 195,
    destination: "Mediterranean",
    image: "/paragliding-flying-sky-adventure.jpg",
  },
  {
    id: 12,
    name: "Maldives Luxury",
    length: 175,
    pricePerNight: 26000,
    homeport: "Maldives",
    flag: "🇲🇻",
    crew: 12,
    size: 175,
    destination: "Maldives",
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
  },
]

// Sample cruise data
const luxuryCruises = [
  {
    id: 1,
    cruiseLine: "Silversea",
    shipName: "Silver Spirit",
    departurePort: "Barcelona, Spain",
    duration: 7,
    cabinType: "Owner Suite",
    pricePerPerson: 8500,
    image: "/majestic-mountain-landscape-with-blue-sky-adventur.jpg",
    itinerary: ["Barcelona", "Monaco", "Portofino", "Amalfi", "Sicily"],
  },
  {
    id: 2,
    cruiseLine: "Seabourn",
    shipName: "Seabourn Ovation",
    departurePort: "Venice, Italy",
    duration: 10,
    cabinType: "Veranda Suite",
    pricePerPerson: 7200,
    image: "/swiss-alps-mountains-snow-travel.jpg",
    itinerary: ["Venice", "Dubrovnik", "Santorini", "Mykonos", "Istanbul"],
  },
  {
    id: 3,
    cruiseLine: "Regent Seven Seas",
    shipName: "Seven Seas Explorer",
    departurePort: "Singapore",
    duration: 14,
    cabinType: "Balcony Suite",
    pricePerPerson: 12000,
    image: "/camping-tent-nature-forest-night.jpg",
    itinerary: ["Singapore", "Bangkok", "Ho Chi Minh", "Hanoi", "Hong Kong"],
  },
  {
    id: 4,
    cruiseLine: "Crystal Cruises",
    shipName: "Crystal Symphony",
    departurePort: "Sydney, Australia",
    duration: 12,
    cabinType: "Penthouse Suite",
    pricePerPerson: 9500,
    image: "/valley-hiking-adventure-green-mountains.jpg",
    itinerary: ["Sydney", "Melbourne", "Auckland", "Wellington", "Fiji"],
  },
]

const destinations = [
  "Maldives",
  "Greece",
  "Caribbean",
  "Bahamas",
  "Mediterranean",
  "Seychelles",
  "Thailand",
  "Croatia",
  "French Riviera",
  "Alaska",
  "Barcelona",
  "Monaco",
  "Portofino",
  "Amalfi",
  "Sicily",
  "Venice",
  "Dubrovnik",
  "Santorini",
  "Mykonos",
  "Istanbul",
]

export default function YachtsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [searchForm, setSearchForm] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    budget: [5000, 500000],
  })
  const [selectedFilters, setSelectedFilters] = useState({
    size: [] as number[],
    crew: [] as number[],
    destinations: [] as string[],
  })
  const [displayedYachts, setDisplayedYachts] = useState(12)
  const [cruiseFilters, setCruiseFilters] = useState({
    cruiseLine: "",
    departurePort: "",
    duration: "",
    cabinType: "",
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredYachts = featuredYachts.filter((yacht) => {
    if (selectedFilters.size.length > 0 && !selectedFilters.size.includes(yacht.size)) return false
    if (selectedFilters.crew.length > 0 && !selectedFilters.crew.includes(yacht.crew)) return false
    if (selectedFilters.destinations.length > 0 && !selectedFilters.destinations.includes(yacht.destination))
      return false
    if (searchForm.budget[0] > 0 && yacht.pricePerNight * 7 < searchForm.budget[0]) return false
    if (searchForm.budget[1] < 500000 && yacht.pricePerNight * 7 > searchForm.budget[1]) return false
    return true
  })

  const filteredCruises = luxuryCruises.filter((cruise) => {
    if (cruiseFilters.cruiseLine && cruise.cruiseLine !== cruiseFilters.cruiseLine) return false
    if (cruiseFilters.departurePort && cruise.departurePort !== cruiseFilters.departurePort) return false
    if (cruiseFilters.duration && cruise.duration.toString() !== cruiseFilters.duration) return false
    if (cruiseFilters.cabinType && cruise.cabinType !== cruiseFilters.cabinType) return false
    return true
  })

  const toggleFilter = (type: "size" | "crew" | "destinations", value: number | string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value) ? prev[type].filter((v) => v !== value) : [...prev[type], value],
    }))
  }

  const loadMoreYachts = () => {
    setDisplayedYachts((prev) => Math.min(prev + 6, featuredYachts.length))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Video Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Video Background - Using image as placeholder (replace with actual video file) */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/cruise-ship-ocean-travel-luxury.jpg')",
            }}
          />
          {/* Video overlay would go here when video file is added */}
          {/* 
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/superyacht-video-background.mp4" type="video/mp4" />
          </video>
          */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-16">
          <div className={`text-center mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6">
              <span className="text-[#D4AF37]">Discover Superyachts Worldwide</span>
            </h1>
            <p className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto">
              Experience unparalleled luxury on the world&apos;s most exclusive superyachts
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-card/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Destination */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Destination
                  </label>
                  <select
                    value={searchForm.destination}
                    onChange={(e) => setSearchForm({ ...searchForm, destination: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Destination (200+ ports)</option>
                    {destinations.map((dest) => (
                      <option key={dest} value={dest}>
                        {dest}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Dates
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={searchForm.checkIn}
                      onChange={(e) => setSearchForm({ ...searchForm, checkIn: e.target.value })}
                      className="bg-background border-border text-white"
                    />
                    <Input
                      type="date"
                      value={searchForm.checkOut}
                      onChange={(e) => setSearchForm({ ...searchForm, checkOut: e.target.value })}
                      className="bg-background border-border text-white"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Guests
                  </label>
                  <select
                    value={searchForm.guests}
                    onChange={(e) => setSearchForm({ ...searchForm, guests: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {Array.from({ length: 19 }, (_, i) => i + 2).map((num) => (
                      <option key={num} value={num}>
                        {num} Guests
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget Slider */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget: ${searchForm.budget[0].toLocaleString()} - ${searchForm.budget[1].toLocaleString()}/week
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={searchForm.budget[0]}
                    onChange={(e) =>
                      setSearchForm({
                        ...searchForm,
                        budget: [parseInt(e.target.value), searchForm.budget[1]],
                      })
                    }
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={searchForm.budget[1]}
                    onChange={(e) =>
                      setSearchForm({
                        ...searchForm,
                        budget: [searchForm.budget[0], parseInt(e.target.value)],
                      })
                    }
                    className="absolute top-0 w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#B8941F] hover:to-[#D4AF37] text-black font-bold text-lg py-6 rounded-xl"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Explore Luxury
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yacht Explorer Carousel */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
              Featured <span className="text-primary">Superyachts</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover the world&apos;s most luxurious yachts available for charter
            </p>
          </div>

          {/* Filter Chips */}
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-2 text-white font-medium">
              <Filter className="w-4 h-4" />
              Filters:
            </div>
            {/* Size Filters */}
            {[140, 160, 180, 200, 220].map((size) => (
              <button
                key={size}
                onClick={() => toggleFilter("size", size)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFilters.size.includes(size)
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {size}ft
              </button>
            ))}
            {/* Crew Filters */}
            {[9, 12, 14, 16].map((crew) => (
              <button
                key={crew}
                onClick={() => toggleFilter("crew", crew)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFilters.crew.includes(crew)
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {crew} Crew
              </button>
            ))}
            {/* Destination Filters */}
            {["Maldives", "Greece", "Caribbean", "Mediterranean"].map((dest) => (
              <button
                key={dest}
                onClick={() => toggleFilter("destinations", dest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFilters.destinations.includes(dest)
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {dest}
              </button>
            ))}
            {/* Clear Filters */}
            {(selectedFilters.size.length > 0 ||
              selectedFilters.crew.length > 0 ||
              selectedFilters.destinations.length > 0) && (
              <button
                onClick={() => setSelectedFilters({ size: [], crew: [], destinations: [] })}
                className="px-4 py-2 rounded-full text-sm font-medium bg-destructive text-white hover:bg-destructive/90 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Yacht Carousel */}
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {filteredYachts.slice(0, displayedYachts).map((yacht, index) => (
                <CarouselItem key={yacht.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Link href={`/yachts/${yacht.id}`}>
                    <div className="group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 h-full">
                      {/* 360° Image Viewer Placeholder */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={yacht.image || "/placeholder.svg"}
                          alt={yacht.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 z-10">
                          <span className="text-2xl">{yacht.flag}</span>
                        </div>
                        <div className="absolute bottom-4 left-4 z-10">
                          <div className="flex items-center gap-2 text-white mb-1">
                            <Anchor className="w-4 h-4" />
                            <span className="text-sm font-medium">{yacht.homeport}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                          {yacht.name}
                        </h3>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <Ship className="w-4 h-4" />
                            {yacht.length}ft
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {yacht.crew} Crew
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <p className="text-2xl font-bold text-primary">${yacht.pricePerNight.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">per night</p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 rounded-full"
                            onClick={(e) => {
                              e.preventDefault()
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
            <CarouselNext className="hidden md:flex -right-12 border-border bg-background/80 backdrop-blur-sm hover:bg-background rounded-full" />
          </Carousel>

          {/* Load More Button */}
          {displayedYachts < filteredYachts.length && (
            <div className="text-center mt-12">
              <Button
                onClick={loadMoreYachts}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8"
              >
                Load More Yachts
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Live Cruise Marketplace */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
              Luxury <span className="text-primary">Cruise Marketplace</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore world-class cruises from the finest luxury cruise lines
            </p>
          </div>

          {/* Cruise Filters */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Cruise Line</label>
                <select
                  value={cruiseFilters.cruiseLine}
                  onChange={(e) => setCruiseFilters({ ...cruiseFilters, cruiseLine: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Lines</option>
                  <option value="Silversea">Silversea</option>
                  <option value="Seabourn">Seabourn</option>
                  <option value="Regent Seven Seas">Regent Seven Seas</option>
                  <option value="Crystal Cruises">Crystal Cruises</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Departure Port</label>
                <select
                  value={cruiseFilters.departurePort}
                  onChange={(e) => setCruiseFilters({ ...cruiseFilters, departurePort: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Ports</option>
                  <option value="Barcelona, Spain">Barcelona, Spain</option>
                  <option value="Venice, Italy">Venice, Italy</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Sydney, Australia">Sydney, Australia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Duration</label>
                <select
                  value={cruiseFilters.duration}
                  onChange={(e) => setCruiseFilters({ ...cruiseFilters, duration: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Durations</option>
                  <option value="7">7 nights</option>
                  <option value="10">10 nights</option>
                  <option value="12">12 nights</option>
                  <option value="14">14 nights</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Cabin Type</label>
                <select
                  value={cruiseFilters.cabinType}
                  onChange={(e) => setCruiseFilters({ ...cruiseFilters, cabinType: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Cabins</option>
                  <option value="Owner Suite">Owner Suite</option>
                  <option value="Veranda Suite">Veranda Suite</option>
                  <option value="Balcony Suite">Balcony Suite</option>
                  <option value="Penthouse Suite">Penthouse Suite</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cruise Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCruises.map((cruise, index) => (
              <Link key={cruise.id} href={`/cruises/${cruise.id}`}>
                <div
                  className={`group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 h-full ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={cruise.image || "/placeholder.svg"}
                      alt={cruise.shipName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
                      <span className="text-white text-xs font-semibold">{cruise.cruiseLine}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {cruise.shipName}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {cruise.departurePort}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {cruise.duration} nights
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        {cruise.cabinType}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-2xl font-bold text-primary">${cruise.pricePerPerson.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 rounded-full"
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                      >
                        View Cabins
                      </Button>
                    </div>
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
