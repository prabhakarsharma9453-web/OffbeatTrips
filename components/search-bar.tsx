"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, MapPin, Globe, Hotel, Activity, ArrowRight, X, Loader2, Route } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Local (non-DB) search targets
const staticDestinations = [
  { id: 1, title: "Domestic Destinations", type: "Domestic", url: "/destinations/domestic" },
  { id: 2, title: "International Destinations", type: "International", url: "/destinations/international" },
]

const staticActivities = [
  { id: 1, title: "Hiking", url: "/activities/hiking" },
  { id: 2, title: "Camping", url: "/activities/camping" },
  { id: 3, title: "Water Sports", url: "/activities/water-sports" },
  { id: 4, title: "Paragliding", url: "/activities/paragliding" },
  { id: 5, title: "Skiing", url: "/activities/skiing" },
  { id: 6, title: "Cycling", url: "/activities/cycling" },
  { id: 7, title: "Cruises", url: "/activities/cruises" },
  { id: 8, title: "Photography Tours", url: "/activities/photography-tours" },
]

interface SearchResult {
  id: string
  title: string
  location?: string
  country?: string
  type?: string
  category: "package" | "resort" | "trip" | "destination" | "activity"
  url: string
  image?: string
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const performSearch = useCallback(async (query: string) => {
    if (!query || query.trim().length === 0) {
      setResults([])
      setShowResults(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
      const result = await response.json()

      if (result.success && result.data) {
        const apiResults: SearchResult[] = (result.data.all || []) as SearchResult[]

        // Local matches (destinations + activity pages)
        const qLower = query.trim().toLowerCase()
        const localResults: SearchResult[] = []

        staticDestinations.forEach((d) => {
          if (d.title.toLowerCase().includes(qLower) || d.type.toLowerCase().includes(qLower)) {
            localResults.push({
              id: `dest-${d.id}`,
              title: d.title,
              type: d.type,
              category: "destination",
              url: d.url,
            })
          }
        })

        staticActivities.forEach((a) => {
          if (a.title.toLowerCase().includes(qLower)) {
            localResults.push({
              id: `activity-${a.id}`,
              title: a.title,
              category: "activity",
              url: a.url,
            })
          }
        })

        // Merge + de-dupe
        const merged = [...apiResults, ...localResults]
        const deduped: SearchResult[] = []
        const seen = new Set<string>()
        for (const r of merged) {
          const key = `${r.category}|${r.title}|${r.url}`
          if (seen.has(key)) continue
          seen.add(key)
          deduped.push(r)
        }

        setResults(deduped.slice(0, 12))
        setShowResults(deduped.length > 0)
      } else {
        setResults([])
        setShowResults(false)
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setShowResults(false)
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      performSearch(searchQuery)
    }, 300) // 300ms debounce delay

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchQuery, performSearch])

  const getCategoryIcon = (category: SearchResult["category"]) => {
    switch (category) {
      case "package":
        return <Globe className="w-4 h-4" />
      case "resort":
        return <Hotel className="w-4 h-4" />
      case "trip":
        return <Route className="w-4 h-4" />
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
      case "trip":
        return "Trip"
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
          <div className="flex items-center gap-2 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-3">
            {/* Search Icon */}
            <div className="flex-shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20 group-focus-within:border-primary/40 group-focus-within:bg-gradient-to-br group-focus-within:from-primary/30 group-focus-within:to-secondary/30 transition-all duration-300">
              {isSearching ? (
                <Loader2 className="w-4 h-4 md:w-4 md:h-4 text-primary animate-spin" />
              ) : (
                <Search className="w-4 h-4 md:w-4 md:h-4 text-primary group-focus-within:scale-110 transition-transform duration-300" />
              )}
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
                aria-label="Clear search"
                title="Clear search"
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
                    {(result.location || result.country || result.type) && (
                      <p className="text-sm text-muted-foreground truncate">
                        {result.location || result.country || result.type}
                        {result.country && result.location && result.country !== result.location && `, ${result.country}`}
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
