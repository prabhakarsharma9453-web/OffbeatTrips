"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { MapPin, DollarSign, Clock, Star, Ship, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const internationalCruises = [
  {
    id: 1,
    title: "Mediterranean Cruise",
    location: "Mediterranean Sea",
    price: "$2,499",
    duration: "7 Days",
    rating: 4.9,
    image: "/cruise-ship-ocean-travel-luxury.jpg",
    description: "Explore beautiful Mediterranean ports including Greece, Italy, and Spain.",
    difficulty: "Easy",
    groupSize: "Max 200 people",
  },
  {
    id: 2,
    title: "Caribbean Island Hopping",
    location: "Caribbean",
    price: "$1,999",
    duration: "6 Days",
    rating: 4.8,
    image: "/cruise-ship-ocean-travel-luxury.jpg",
    description: "Visit multiple Caribbean islands with crystal-clear waters and white sand beaches.",
    difficulty: "Easy",
    groupSize: "Max 180 people",
  },
  {
    id: 3,
    title: "Alaska Glacier Cruise",
    location: "Alaska, USA",
    price: "$3,299",
    duration: "8 Days",
    rating: 4.9,
    image: "/cruise-ship-ocean-travel-luxury.jpg",
    description: "Witness glaciers, wildlife, and stunning Alaskan wilderness from the sea.",
    difficulty: "Easy",
    groupSize: "Max 150 people",
  },
  {
    id: 4,
    title: "Norwegian Fjords Cruise",
    location: "Norway",
    price: "$2,799",
    duration: "7 Days",
    rating: 4.8,
    image: "/norway-fjords-beautiful-water-mountains.jpg",
    description: "Sail through Norway's breathtaking fjords and witness the Northern Lights.",
    difficulty: "Easy",
    groupSize: "Max 160 people",
  },
]

const domesticCruises = [
  {
    id: 5,
    title: "Kerala Backwater Cruise",
    location: "Kerala, India",
    price: "₹12,999",
    duration: "3 Days",
    rating: 4.8,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    description: "Experience Kerala's serene backwaters on a traditional houseboat cruise.",
    difficulty: "Easy",
    groupSize: "Max 8 people",
  },
  {
    id: 6,
    title: "Andaman Islands Cruise",
    location: "Andaman Islands, India",
    price: "₹18,999",
    duration: "5 Days",
    rating: 4.9,
    image: "/cruise-ship-ocean-travel-luxury.jpg",
    description: "Explore the beautiful Andaman Islands with pristine beaches and coral reefs.",
    difficulty: "Easy",
    groupSize: "Max 50 people",
  },
  {
    id: 7,
    title: "Goa Coastal Cruise",
    location: "Goa, India",
    price: "₹8,999",
    duration: "2 Days",
    rating: 4.7,
    image: "/cruise-ship-ocean-travel-luxury.jpg",
    description: "Enjoy a relaxing coastal cruise along Goa's beautiful coastline.",
    difficulty: "Easy",
    groupSize: "Max 40 people",
  },
  {
    id: 8,
    title: "Ganges River Cruise",
    location: "West Bengal, India",
    price: "₹15,999",
    duration: "4 Days",
    rating: 4.6,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    description: "Cruise along the Ganges River with cultural experiences and scenic views.",
    difficulty: "Easy",
    groupSize: "Max 30 people",
  },
]

export default function CruisesPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "international" | "domestic">("all")
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const allActivities = [...internationalCruises, ...domesticCruises]
  const filteredActivities =
    activeTab === "all"
      ? allActivities
      : activeTab === "international"
        ? internationalCruises
        : domesticCruises

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
          <Ship className="w-3.5 h-3.5 text-white" />
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
          <Link href="/yachts">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 rounded-full px-4 py-1.5 text-xs transition-all duration-300 hover:scale-105"
            >
              View Cruises
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
              Cruise <span className="text-primary">Adventures</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Set sail on unforgettable cruise experiences to stunning destinations
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full mb-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-muted rounded-full">
              <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">
                All Cruises
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
              Found <span className="text-primary font-semibold">{filteredActivities.length}</span> cruise options
            </p>
          </div>

          {filteredActivities.length > 0 ? (
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
              <p className="text-muted-foreground text-lg">No cruises found.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
