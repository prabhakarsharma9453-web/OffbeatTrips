"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, Star, Sparkles, Search, Filter, Crown, TrendingUp, Award, Loader2, Globe, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const luxuryQuotes = [
  "Luxury is not a place, it's an experience.",
  "Elegance is the only beauty that never fades.",
  "True luxury is being able to own your time.",
  "Luxury must be comfortable, otherwise it is not luxury.",
  "The best luxury is the luxury of being yourself.",
]

// Resort interface
interface Resort {
  id: string
  title: string
  location: string
  price: string
  rating: number
  image: string
  amenities: string[]
  featured: boolean
  popular: boolean
  type?: 'domestic' | 'international'
}

export default function AllResortsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"popular" | "featured" | "rating" | "price">("popular")
  const sectionRef = useRef<HTMLElement>(null)
  const [currentQuote, setCurrentQuote] = useState(luxuryQuotes[0])
  const [allResorts, setAllResorts] = useState<Resort[]>([])
  const [internationalResorts, setInternationalResorts] = useState<Resort[]>([])
  const [domesticResorts, setDomesticResorts] = useState<Resort[]>([])
  const [locations, setLocations] = useState<string[]>(["All Locations"])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "international" | "domestic">("all")

  // Fetch resorts from MongoDB
  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch all resorts
        const allResponse = await fetch('/api/resorts')
        const allData = await allResponse.json()

        if (allData.success) {
          const resorts = allData.data || []
          setAllResorts(resorts)

          // Separate by type
          const international = resorts.filter((r: Resort) => r.type === 'international')
          const domestic = resorts.filter((r: Resort) => r.type === 'domestic')
          setInternationalResorts(international)
          setDomesticResorts(domestic)

          // Extract unique locations
          const uniqueLocations = Array.from(
            new Set(resorts.map((r: Resort) => r.location).filter(Boolean))
          )
          setLocations(["All Locations", ...uniqueLocations])
        } else {
          setError(allData.error || "Failed to fetch resorts")
          setAllResorts([])
          setInternationalResorts([])
          setDomesticResorts([])
        }
      } catch (error) {
        console.error('Error fetching resorts:', error)
        setError(error instanceof Error ? error.message : "Failed to fetch resorts")
        setAllResorts([])
        setInternationalResorts([])
        setDomesticResorts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResorts()
  }, [])

  useEffect(() => {
    setIsVisible(true)
    const quoteInterval = setInterval(() => {
      setCurrentQuote(luxuryQuotes[Math.floor(Math.random() * luxuryQuotes.length)])
    }, 5000)
    return () => clearInterval(quoteInterval)
  }, [])

  // Get resorts based on active tab
  const getResortsForTab = () => {
    if (activeTab === "international") return internationalResorts
    if (activeTab === "domestic") return domesticResorts
    return allResorts
  }

  const filteredResorts = getResortsForTab()
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

  const ResortCard = ({ resort, index }: { resort: Resort; index: number }) => (
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
          <Link href={`/resorts/${resort.id}`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-5 py-2 text-sm transition-all duration-300 hover:scale-105"
            >
              Explore
            </Button>
          </Link>
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

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Loading resorts...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-16">
              <p className="text-destructive text-lg mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="rounded-full"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Type Tabs */}
          {!isLoading && !error && (
            <div className="mb-8">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-card/60 backdrop-blur-md border border-border/50 rounded-full p-1">
                  <TabsTrigger
                    value="all"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
                  >
                    All Resorts ({allResorts.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="international"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    International ({internationalResorts.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="domestic"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Domestic ({domesticResorts.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-8">
                  <div className="mb-8 text-center">
                    <p className="text-muted-foreground text-lg">
                      Discover <span className="text-primary font-bold text-xl">{filteredResorts.length}</span> luxury resorts
                    </p>
                  </div>
                  {filteredResorts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {filteredResorts.map((resort, index) => (
                        <ResortCard key={resort.id} resort={resort} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground text-lg">No resorts found matching your criteria.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="international" className="mt-8">
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-full mb-4">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm font-semibold">International Resorts</span>
                    </div>
                    <p className="text-muted-foreground text-lg">
                      Discover <span className="text-primary font-bold text-xl">{filteredResorts.length}</span> international resorts
                    </p>
                  </div>
                  {filteredResorts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {filteredResorts.map((resort, index) => (
                        <ResortCard key={resort.id} resort={resort} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground text-lg">No international resorts found matching your criteria.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="domestic" className="mt-8">
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full mb-4">
                      <Home className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm font-semibold">Domestic Resorts</span>
                    </div>
                    <p className="text-muted-foreground text-lg">
                      Discover <span className="text-primary font-bold text-xl">{filteredResorts.length}</span> domestic resorts
                    </p>
                  </div>
                  {filteredResorts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {filteredResorts.map((resort, index) => (
                        <ResortCard key={resort.id} resort={resort} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground text-lg">No domestic resorts found matching your criteria.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
