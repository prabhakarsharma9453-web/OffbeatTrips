"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { MapPin, DollarSign, Clock, Star, Bike, Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const internationalCycling = [
  {
    id: 1,
    title: "Amsterdam Bike Tour",
    location: "Amsterdam, Netherlands",
    price: "$299",
    duration: "3 Days",
    rating: 4.8,
    image: "/cycling-mountain-bike-trail-adventure.jpg",
    description: "Explore Amsterdam's canals and historic streets on a guided cycling tour.",
    difficulty: "Easy",
    groupSize: "Max 15 people",
  },
  {
    id: 2,
    title: "Vietnam Countryside Cycling",
    location: "Vietnam",
    price: "$799",
    duration: "6 Days",
    rating: 4.9,
    image: "/cycling-mountain-bike-trail-adventure.jpg",
    description: "Cycle through Vietnam's beautiful countryside and rural villages.",
    difficulty: "Moderate",
    groupSize: "Max 12 people",
  },
  {
    id: 3,
    title: "New Zealand Cycle Trail",
    location: "New Zealand",
    price: "$1,299",
    duration: "7 Days",
    rating: 4.8,
    image: "/cycling-mountain-bike-trail-adventure.jpg",
    description: "Cycle through New Zealand's stunning landscapes and coastal routes.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 10 people",
  },
  {
    id: 4,
    title: "Tuscany Cycling Tour",
    location: "Italy",
    price: "$1,199",
    duration: "5 Days",
    rating: 4.9,
    image: "/cycling-mountain-bike-trail-adventure.jpg",
    description: "Pedal through Tuscany's rolling hills, vineyards, and medieval towns.",
    difficulty: "Moderate",
    groupSize: "Max 12 people",
  },
]

const domesticCycling = [
  {
    id: 5,
    title: "Ladakh Cycling Expedition",
    location: "Ladakh, India",
    price: "₹24,999",
    duration: "8 Days",
    rating: 4.9,
    image: "/cycling-mountain-bike-trail-adventure.jpg",
    description: "Challenge yourself with high-altitude cycling through Ladakh's dramatic landscapes.",
    difficulty: "Difficult",
    groupSize: "Max 8 people",
  },
  {
    id: 6,
    title: "Manali to Leh Cycling",
    location: "Himachal Pradesh to Ladakh",
    price: "₹32,999",
    duration: "12 Days",
    rating: 4.8,
    image: "/cycling-mountain-bike-trail-adventure.jpg",
    description: "Epic cycling journey from Manali to Leh, one of the world's highest roads.",
    difficulty: "Difficult",
    groupSize: "Max 10 people",
  },
  {
    id: 7,
    title: "Kerala Backwaters Cycling",
    location: "Kerala, India",
    price: "₹8,999",
    duration: "4 Days",
    rating: 4.7,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    description: "Cycle through Kerala's backwaters, paddy fields, and coconut groves.",
    difficulty: "Easy to Moderate",
    groupSize: "Max 12 people",
  },
  {
    id: 8,
    title: "Coorg Coffee Plantation Cycling",
    location: "Karnataka, India",
    price: "₹6,999",
    duration: "3 Days",
    rating: 4.6,
    image: "/cycling-mountain-bike-trail-adventure.jpg",
    description: "Cycle through Coorg's beautiful coffee plantations and misty hills.",
    difficulty: "Moderate",
    groupSize: "Max 10 people",
  },
]

export default function CyclingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "international" | "domestic">("all")
  const [dbTrips, setDbTrips] = useState<TripItem[]>([])
  const [isTripsLoading, setIsTripsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        setIsTripsLoading(true)
        const res = await fetch("/api/trips?activity=cycling")
        const json = await res.json()
        setDbTrips(json.success ? (json.data || []) : [])
      } catch {
        setDbTrips([])
      } finally {
        setIsTripsLoading(false)
      }
    }
    load()
  }, [])

  const allActivities = dbTrips
  const filteredActivities = activeTab === "all" ? allActivities : allActivities.filter((t) => t.type === activeTab)

  const ActivityCard = ({ activity }: { activity: (typeof allActivities)[0] }) => (
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
          <Bike className="w-3.5 h-3.5 text-white" />
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
          <div className={`text-center mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Cycling <span className="text-primary">Adventures</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Explore destinations on two wheels with guided cycling tours
            </p>
          </div>

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

          <div className="mb-8 text-center">
            <p className="text-muted-foreground">
              Found <span className="text-primary font-semibold">{filteredActivities.length}</span> cycling trips
            </p>
          </div>

          {isTripsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={isVisible ? "animate-fade-in-up" : "opacity-0"}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ActivityCard activity={activity} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No cycling trips found. (Admin can add trips in Admin → Trips)</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
