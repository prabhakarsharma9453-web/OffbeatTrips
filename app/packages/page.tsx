"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, Clock, Star, ArrowRight, Search, Filter, Sparkles, Quote, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const inspirationalQuotes = [
  "Adventure is not outside man; it is within.",
  "Travel far enough, you meet yourself.",
  "Life is either a daring adventure or nothing at all.",
  "The world is a book, and those who do not travel read only one page.",
  "Not all those who wander are lost.",
]

const moods = ["Adventure", "Relaxation", "Romance", "Family", "Solo", "Luxury", "Cultural", "Nature"]
const activities = ["Hiking", "Camping", "Swimming", "Sightseeing", "Wildlife", "Photography", "Skiing", "Water Sports"]
const budgetRanges = [
  { label: "All Budgets", value: "all" },
  { label: "Under ₹20,000", value: "under-20k" },
  { label: "₹20,000 - ₹30,000", value: "20k-30k" },
  { label: "₹30,000 - ₹50,000", value: "30k-50k" },
  { label: "Over ₹50,000", value: "over-50k" },
  { label: "Under $1,500", value: "under-1500" },
  { label: "$1,500 - $2,500", value: "1500-2500" },
  { label: "Over $2,500", value: "over-2500" },
]

interface Package {
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

export default function AllPackagesPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "international" | "domestic">("domestic")
  const sectionRef = useRef<HTMLElement>(null)
  const [currentQuote, setCurrentQuote] = useState(inspirationalQuotes[0])
  const [allPackages, setAllPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch packages from MongoDB
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/packages')
        const result = await response.json()

        if (result.success) {
          setAllPackages(result.data || [])
        } else {
          console.error('Error fetching packages:', result.error)
          setAllPackages([])
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
        setAllPackages([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, [])

  useEffect(() => {
    setIsVisible(true)
    const quoteInterval = setInterval(() => {
      setCurrentQuote(inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)])
    }, 5000)
    return () => clearInterval(quoteInterval)
  }, [])

  // Helper function to convert price to number for comparison
  const getPriceValue = (price: string): number => {
    const numericValue = price.replace(/[₹$,]/g, "")
    return parseFloat(numericValue) || 0
  }

  const filteredPackages = allPackages.filter((pkg) => {
    const matchesTab =
      activeTab === "all" || (activeTab === "international" && pkg.type === "international") || (activeTab === "domestic" && pkg.type === "domestic")
    const matchesMood = !selectedMood // Mood not in database yet, skip filter
    const matchesActivity = !selectedActivity || (pkg.activities && Array.isArray(pkg.activities) && pkg.activities.includes(selectedActivity))
    const matchesSearch = !searchQuery || pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || pkg.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Budget filter logic
    let matchesBudget = true
    if (selectedBudget && selectedBudget !== "all") {
      const priceValue = getPriceValue(pkg.price)
      const isINR = pkg.price.includes("₹")
      
      if (isINR) {
        switch (selectedBudget) {
          case "under-20k":
            matchesBudget = priceValue < 20000
            break
          case "20k-30k":
            matchesBudget = priceValue >= 20000 && priceValue <= 30000
            break
          case "30k-50k":
            matchesBudget = priceValue > 30000 && priceValue <= 50000
            break
          case "over-50k":
            matchesBudget = priceValue > 50000
            break
          default:
            matchesBudget = true
        }
      } else {
        // USD prices
        switch (selectedBudget) {
          case "under-1500":
            matchesBudget = priceValue < 1500
            break
          case "1500-2500":
            matchesBudget = priceValue >= 1500 && priceValue <= 2500
            break
          case "over-2500":
            matchesBudget = priceValue > 2500
            break
          default:
            matchesBudget = true
        }
      }
      
      // If selected budget is for INR but package is USD (or vice versa), exclude it
      const isINRBudget = selectedBudget.includes("k") || selectedBudget === "over-50k"
      if (isINRBudget && !isINR) matchesBudget = false
      if (!isINRBudget && isINR) matchesBudget = false
    }
    
    return matchesTab && matchesMood && matchesActivity && matchesSearch && matchesBudget
  })

  const PackageCard = ({ pkg, index }: { pkg: Package; index: number }) => (
    <div
      className={`group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-64 overflow-hidden rounded-t-3xl">
        <img
          src={pkg.image || "/placeholder.svg"}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-t-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent rounded-t-3xl" />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-white text-sm font-semibold">{pkg.rating}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <MapPin className="w-4 h-4" />
          {pkg.location}
        </div>
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">
          {pkg.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {pkg.highlights.map((highlight) => (
            <span
              key={highlight}
              className="text-xs bg-muted/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-muted-foreground border border-border/50"
            >
              {highlight}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-2xl font-bold text-primary">{pkg.price}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {pkg.duration}
            </p>
          </div>
          <Link href={`/packages/${pkg.slug}`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 rounded-full px-6 transition-all duration-300 hover:scale-105"
            >
              Explore
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
          {/* Hero Section with Quote */}
          <div className={`text-center mb-8 sm:mb-12 lg:mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">Premium Travel Experiences</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover Your <span className="text-primary">Perfect Adventure</span>
            </h1>
            <div className="max-w-3xl mx-auto relative">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8">
                <Quote className="w-8 h-8 text-primary/50 mb-4 mx-auto" />
                <p className="text-lg md:text-xl text-white/90 font-medium italic transition-all duration-500">
                  &ldquo;{currentQuote}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={`mb-8 sm:mb-10 lg:mb-10 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "200ms" }}>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-6">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search packages by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-background/50 border-border rounded-full"
                />
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Mood Filter */}
                  <div>
                    <label className="text-sm font-medium text-white mb-3 block flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter by Mood
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {moods.map((mood) => (
                        <button
                          key={mood}
                          onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            selectedMood === mood
                              ? "bg-primary text-white shadow-lg shadow-primary/30"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-white border border-border"
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Activity Filter */}
                  <div>
                    <label className="text-sm font-medium text-white mb-3 block flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter by Activity
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activities.map((activity) => (
                        <button
                          key={activity}
                          onClick={() => setSelectedActivity(selectedActivity === activity ? null : activity)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            selectedActivity === activity
                              ? "bg-primary text-white shadow-lg shadow-primary/30"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-white border border-border"
                          }`}
                        >
                          {activity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Budget Filter */}
                <div>
                  <label className="text-sm font-medium text-white mb-3 block flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter by Budget
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {budgetRanges.map((budget) => (
                      <button
                        key={budget.value}
                        onClick={() => setSelectedBudget(selectedBudget === budget.value ? null : budget.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedBudget === budget.value
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-white border border-border"
                        }`}
                      >
                        {budget.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full mb-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-muted rounded-full">
              <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">
                All Packages
              </TabsTrigger>
              <TabsTrigger value="international" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">
                International
              </TabsTrigger>
              <TabsTrigger value="domestic" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">
                Domestic
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Results Count */}
          <div className="mb-8 text-center">
            <p className="text-muted-foreground">
              Found <span className="text-primary font-semibold">{filteredPackages.length}</span> packages matching your preferences
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Loading packages...</p>
            </div>
          )}

          {/* Packages Grid */}
          {!isLoading && filteredPackages.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredPackages.map((pkg, index) => (
                <PackageCard key={pkg.slug || pkg.id} pkg={pkg} index={index} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredPackages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No packages found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSelectedMood(null)
                  setSelectedActivity(null)
                  setSelectedBudget(null)
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
