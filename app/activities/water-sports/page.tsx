"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { MapPin, DollarSign, Clock, Star, Waves, Globe, Loader2 } from "lucide-react"
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

const internationalWaterSports = [
  {
    id: 1,
    title: "Maldives Snorkeling & Diving",
    location: "Maldives",
    price: "$1,199",
    duration: "5 Days",
    rating: 4.9,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    description: "Explore vibrant coral reefs and marine life in the crystal-clear waters of the Maldives.",
    difficulty: "Easy to Moderate",
    groupSize: "Max 12 people",
  },
  {
    id: 2,
    title: "Thailand Kayaking Adventure",
    location: "Thailand",
    price: "$899",
    duration: "4 Days",
    rating: 4.8,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    description: "Paddle through Thailand's stunning limestone karsts and hidden lagoons.",
    difficulty: "Moderate",
    groupSize: "Max 10 people",
  },
  {
    id: 3,
    title: "Croatia Sailing & Water Sports",
    location: "Croatia, Europe",
    price: "$1,499",
    duration: "6 Days",
    rating: 4.9,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    description: "Sail along the Dalmatian coast with kayaking, snorkeling, and beach activities.",
    difficulty: "Moderate",
    groupSize: "Max 14 people",
  },
  {
    id: 4,
    title: "Bali Surfing & Water Activities",
    location: "Bali, Indonesia",
    price: "$999",
    duration: "5 Days",
    rating: 4.7,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    description: "Learn to surf and enjoy various water sports in the beautiful waters of Bali.",
    difficulty: "Easy to Moderate",
    groupSize: "Max 12 people",
  },
  {
    id: 5,
    title: "French Riviera Jet Skiing",
    location: "French Riviera, France",
    price: "$1,299",
    duration: "3 Days",
    rating: 4.8,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    description: "Experience high-speed water sports along the glamorous French Riviera.",
    difficulty: "Moderate",
    groupSize: "Max 8 people",
  },
  {
    id: 6,
    title: "Caribbean Scuba Diving",
    location: "Caribbean",
    price: "$1,399",
    duration: "6 Days",
    rating: 4.9,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    description: "Dive into the Caribbean's most beautiful dive sites with certified instructors.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 10 people",
  },
]

const domesticWaterSports = [
  {
    id: 7,
    title: "Goa Beach Water Sports",
    location: "Goa, India",
    price: "₹4,999",
    duration: "2 Days",
    rating: 4.7,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    description: "Enjoy jet skiing, parasailing, and banana boat rides on Goa's beautiful beaches.",
    difficulty: "Easy",
    groupSize: "Max 15 people",
  },
  {
    id: 8,
    title: "Kerala Backwater Kayaking",
    location: "Kerala, India",
    price: "₹5,999",
    duration: "3 Days",
    rating: 4.8,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    description: "Paddle through Kerala's serene backwaters and experience the local culture.",
    difficulty: "Easy to Moderate",
    groupSize: "Max 12 people",
  },
  {
    id: 9,
    title: "Andaman Scuba Diving",
    location: "Andaman Islands, India",
    price: "₹12,999",
    duration: "4 Days",
    rating: 4.9,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    description: "Explore the vibrant underwater world of the Andaman Islands.",
    difficulty: "Moderate",
    groupSize: "Max 10 people",
  },
  {
    id: 10,
    title: "Rishikesh River Rafting",
    location: "Uttarakhand, India",
    price: "₹3,999",
    duration: "2 Days",
    rating: 4.8,
    image: "/water-sports-kayaking-rafting-adventure.jpg",
    description: "White water rafting on the Ganges River with varying difficulty levels.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 8 people",
  },
  {
    id: 11,
    title: "Lakshadweep Snorkeling",
    location: "Lakshadweep, India",
    price: "₹15,999",
    duration: "5 Days",
    rating: 4.9,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    description: "Snorkel in the pristine waters of Lakshadweep with amazing coral reefs.",
    difficulty: "Easy to Moderate",
    groupSize: "Max 12 people",
  },
  {
    id: 12,
    title: "Konkan Coast Water Sports",
    location: "Maharashtra, India",
    price: "₹6,999",
    duration: "3 Days",
    rating: 4.6,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    description: "Multiple water sports activities along the beautiful Konkan coastline.",
    difficulty: "Easy",
    groupSize: "Max 15 people",
  },
]

export default function WaterSportsPage() {
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
        const res = await fetch("/api/trips?activity=water-sports")
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
          <Waves className="w-3.5 h-3.5 text-white" />
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
              Water Sports <span className="text-primary">Adventures</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Dive into exciting water sports activities in stunning locations worldwide
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
              Found <span className="text-primary font-semibold">{filteredActivities.length}</span> water sports trips
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
              <p className="text-muted-foreground text-lg">No water sports trips found. (Admin can add trips in Admin → Trips)</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
