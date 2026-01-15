"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Globe, Hotel, Activity, ArrowRight, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Search data - consolidated from various sections
const searchData = {
  packages: [
    { id: 1, title: "Swiss Alps Explorer", location: "Switzerland", type: "International", url: "/packages" },
    { id: 2, title: "Norwegian Fjords", location: "Norway", type: "International", url: "/packages" },
    { id: 3, title: "Thailand Paradise", location: "Thailand", type: "International", url: "/packages" },
    { id: 4, title: "Ladakh Adventure", location: "Ladakh, India", type: "Domestic", url: "/packages" },
    { id: 5, title: "Kerala Backwaters", location: "Kerala, India", type: "Domestic", url: "/packages" },
    { id: 6, title: "Manali Expedition", location: "Himachal Pradesh", type: "Domestic", url: "/packages" },
    { id: 7, title: "Bali Adventure", location: "Indonesia", type: "International", url: "/packages" },
    { id: 8, title: "Rajasthan Royal", location: "Rajasthan, India", type: "Domestic", url: "/packages" },
    { id: 11, title: "Paris Romance", location: "France", type: "International", url: "/packages" },
    { id: 12, title: "Iceland Adventure", location: "Iceland", type: "International", url: "/packages" },
    { id: 13, title: "Goa Beach Escape", location: "Goa, India", type: "Domestic", url: "/packages" },
    { id: 14, title: "Darjeeling Tea Trails", location: "West Bengal", type: "Domestic", url: "/packages" },
  ],
  resorts: [
    { id: 1, title: "The Maldives Paradise Resort", location: "Maldives", url: "/resorts" },
    { id: 2, title: "Swiss Alpine Luxury Lodge", location: "Switzerland", url: "/resorts" },
    { id: 3, title: "Santorini Cliffside Resort", location: "Greece", url: "/resorts" },
    { id: 4, title: "Dubai Desert Oasis", location: "UAE", url: "/resorts" },
    { id: 5, title: "Bali Tropical Retreat", location: "Indonesia", url: "/resorts" },
    { id: 6, title: "Rajasthan Palace Heritage", location: "Rajasthan, India", url: "/resorts" },
    { id: 7, title: "Goa Beachfront Luxury", location: "Goa, India", url: "/resorts" },
    { id: 8, title: "Himalayan Mountain Resort", location: "Himachal Pradesh", url: "/resorts" },
    { id: 9, title: "Kerala Backwaters Luxury", location: "Kerala, India", url: "/resorts" },
    { id: 10, title: "Rishikesh Riverside Resort", location: "Uttarakhand", url: "/resorts" },
  ],
  destinations: [
    { id: 1, title: "Switzerland", type: "International", url: "/destinations/international" },
    { id: 2, title: "Norway", type: "International", url: "/destinations/international" },
    { id: 3, title: "Thailand", type: "International", url: "/destinations/international" },
    { id: 4, title: "Maldives", type: "International", url: "/destinations/international" },
    { id: 5, title: "Bali", type: "International", url: "/destinations/international" },
    { id: 6, title: "Greece", type: "International", url: "/destinations/international" },
    { id: 7, title: "Dubai", type: "International", url: "/destinations/international" },
    { id: 8, title: "Ladakh", type: "Domestic", url: "/destinations/domestic" },
    { id: 9, title: "Kerala", type: "Domestic", url: "/destinations/domestic" },
    { id: 10, title: "Manali", type: "Domestic", url: "/destinations/domestic" },
    { id: 11, title: "Goa", type: "Domestic", url: "/destinations/domestic" },
    { id: 12, title: "Rajasthan", type: "Domestic", url: "/destinations/domestic" },
  ],
  activities: [
    { id: 1, title: "Hiking", url: "/#activities" },
    { id: 2, title: "Camping", url: "/#activities" },
    { id: 3, title: "Water Sports", url: "/#activities" },
    { id: 4, title: "Paragliding", url: "/#activities" },
    { id: 5, title: "Skiing", url: "/#activities" },
    { id: 6, title: "Cycling", url: "/#activities" },
    { id: 7, title: "Cruises", url: "/#activities" },
    { id: 8, title: "Photography Tours", url: "/#activities" },
  ],
}

interface SearchResult {
  id: string
  title: string
  location?: string
  type?: string
  category: "package" | "resort" | "destination" | "activity"
  url: string
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setResults([])
      setShowResults(false)
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const searchResults: SearchResult[] = []

    // Search packages
    searchData.packages.forEach((pkg) => {
      if (
        pkg.title.toLowerCase().includes(query) ||
        pkg.location.toLowerCase().includes(query) ||
        pkg.type.toLowerCase().includes(query)
      ) {
        searchResults.push({
          id: `package-${pkg.id}`,
          title: pkg.title,
          location: pkg.location,
          type: pkg.type,
          category: "package",
          url: pkg.url,
        })
      }
    })

    // Search resorts
    searchData.resorts.forEach((resort) => {
      if (resort.title.toLowerCase().includes(query) || resort.location.toLowerCase().includes(query)) {
        searchResults.push({
          id: `resort-${resort.id}`,
          title: resort.title,
          location: resort.location,
          category: "resort",
          url: resort.url,
        })
      }
    })

    // Search destinations
    searchData.destinations.forEach((dest) => {
      if (dest.title.toLowerCase().includes(query) || dest.type.toLowerCase().includes(query)) {
        searchResults.push({
          id: `dest-${dest.id}`,
          title: dest.title,
          type: dest.type,
          category: "destination",
          url: dest.url,
        })
      }
    })

    // Search activities
    searchData.activities.forEach((activity) => {
      if (activity.title.toLowerCase().includes(query)) {
        searchResults.push({
          id: `activity-${activity.id}`,
          title: activity.title,
          category: "activity",
          url: activity.url,
        })
      }
    })

    setResults(searchResults.slice(0, 8)) // Limit to 8 results
    // Automatically show results when there are matches
    setShowResults(searchResults.length > 0)
  }, [searchQuery])

  const getCategoryIcon = (category: SearchResult["category"]) => {
    switch (category) {
      case "package":
        return <Globe className="w-4 h-4" />
      case "resort":
        return <Hotel className="w-4 h-4" />
      case "destination":
        return <MapPin className="w-4 h-4" />
      case "activity":
        return <Activity className="w-4 h-4" />
    }
  }

  const getCategoryLabel = (category: SearchResult["category"]) => {
    switch (category) {
      case "package":
        return "Package"
      case "resort":
        return "Resort"
      case "destination":
        return "Destination"
      case "activity":
        return "Activity"
    }
  }

  const handleResultClick = () => {
    setSearchQuery("")
    setShowResults(false)
  }

  return (
    <div ref={searchRef} className="relative max-w-full md:max-w-5xl mx-auto px-2 md:px-4 mt-0 mb-0 md:-mt-8 md:mb-16">
      <div className="relative group">
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 rounded-full blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
        
        {/* Main search container */}
        <div className="relative bg-gradient-to-br from-card/90 via-card/80 to-card/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-primary/10 group-focus-within:border-primary/50 group-focus-within:shadow-primary/20 transition-all duration-300">
          <div className="flex items-center gap-2 md:gap-2.5 px-3 py-2.5 md:px-4 md:py-3">
            {/* Search Icon */}
            <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20 group-focus-within:border-primary/40 group-focus-within:bg-gradient-to-br group-focus-within:from-primary/30 group-focus-within:to-secondary/30 transition-all duration-300">
              <Search className="w-4 h-4 md:w-4 md:h-4 text-primary group-focus-within:scale-110 transition-transform duration-300" />
            </div>

            {/* Input Field */}
            <Input
              type="text"
              placeholder="Search for destinations, packages, resorts, or activities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                // Automatically show results when typing
                if (e.target.value.trim().length > 0) {
                  // Results will be shown automatically via useEffect
                } else {
                  setShowResults(false)
                }
              }}
              onFocus={() => {
                // Show results if there are any when focusing
                if (searchQuery.trim().length > 0 && results.length > 0) {
                  setShowResults(true)
                }
              }}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-muted-foreground/70 text-sm md:text-base font-medium py-1 md:py-1.5 px-0 placeholder:text-xs md:placeholder:text-sm"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setShowResults(false)
                }}
                className="flex-shrink-0 w-8 h-8 md:w-8 md:h-8 rounded-full bg-muted/50 hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-white transition-all duration-300 hover:scale-110"
              >
                <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-gradient-to-br from-card/98 via-card/95 to-card/98 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-primary/20 z-50 max-h-[500px] overflow-y-auto animate-fade-in-up">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">
                {results.length} {results.length === 1 ? "result" : "results"} found
              </p>
            </div>
            <div className="space-y-1">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {getCategoryIcon(result.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium group-hover:text-primary transition-colors truncate">
                        {result.title}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary flex-shrink-0">
                        {getCategoryLabel(result.category)}
                      </span>
                    </div>
                    {(result.location || result.type) && (
                      <p className="text-sm text-muted-foreground truncate">
                        {result.location || result.type}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && searchQuery.trim().length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-gradient-to-br from-card/98 via-card/95 to-card/98 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-primary/20 z-50 p-8 text-center animate-fade-in-up">
          <p className="text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
          <p className="text-sm text-muted-foreground mt-2">Try searching for destinations, packages, or resorts</p>
        </div>
      )}
    </div>
  )
}
