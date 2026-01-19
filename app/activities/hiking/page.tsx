"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { MapPin, DollarSign, Clock, Star, Mountain, Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type TripItem = {
  id: string
  slug: string
  title: string
  activity: string
  location: string
  country?: string
  duration: string
  price: string
  rating: number
  image: string
  description?: string
  difficulty?: string
  groupSize?: string
  type: "domestic" | "international"
}

export default function HikingActivitiesPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "international" | "domestic">("all")
  const [trips, setTrips] = useState<TripItem[]>([])
  const [isTripsLoading, setIsTripsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        setIsTripsLoading(true)
        const res = await fetch("/api/trips?activity=hiking")
        const json = await res.json()
        if (json.success) {
          setTrips(json.data || [])
        } else {
          setTrips([])
        }
      } catch {
        setTrips([])
      } finally {
        setIsTripsLoading(false)
      }
    }
    load()
  }, [])

  const filteredActivities =
    activeTab === "all"
      ? trips
      : trips.filter((t) => t.type === activeTab)

  const ActivityCard = ({ activity }: { activity: TripItem }) => (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20">
      <div className="relative h-40 overflow-hidden">
        <img
          src={activity.image || "/placeholder.svg"}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-white text-xs font-semibold">{activity.rating}</span>
        </div>
        <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-2.5 py-1 rounded-full z-10">
          <Mountain className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-2">
          <MapPin className="w-3.5 h-3.5" />
          {activity.location}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {activity.title}
        </h3>
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{activity.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs bg-muted/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-muted-foreground border border-border/50">
            {activity.difficulty}
          </span>
          <span className="text-xs bg-muted/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-muted-foreground border border-border/50">
            {activity.groupSize}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <p className="text-xl font-bold text-primary">{activity.price}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {activity.duration}
            </div>
          </div>
          <Link href="/#contact">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 rounded-full px-4 py-1.5 text-xs transition-all duration-300 hover:scale-105"
            >
              Enquire
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
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <Mountain className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-medium">Hiking Activities</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Explore Hiking <span className="text-primary">Adventures</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Discover thrilling hiking trails across the globe, from mountain peaks to valley trails
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full mb-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-muted rounded-full">
              <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">
                All Activities
              </TabsTrigger>
              <TabsTrigger
                value="international"
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
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
              Found <span className="text-primary font-semibold">{filteredActivities.length}</span> hiking trips
            </p>
          </div>

          {/* Activities Grid */}
          {isTripsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity.id || `${activity.title}-${index}`}
                  className={isVisible ? "animate-fade-in-up" : "opacity-0"}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ActivityCard activity={activity} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No hiking trips found. (Admin can add trips in Admin → Trips)</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
