"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, DollarSign, Clock, Star, Snowflake, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const internationalSkiing = [
  {
    id: 1,
    title: "Swiss Alps Skiing Experience",
    location: "Switzerland, Europe",
    price: "$1,899",
    duration: "5 Days",
    rating: 4.9,
    image: "/skiing-snow-mountains-winter-sport.jpg",
    description: "Ski on world-class slopes in the Swiss Alps with professional instructors.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 12 people",
  },
  {
    id: 2,
    title: "Austria Alpine Skiing",
    location: "Austria, Europe",
    price: "$1,699",
    duration: "6 Days",
    rating: 4.8,
    image: "/swiss-alps-mountains-snow-travel.jpg",
    description: "Experience Austria's legendary ski resorts with stunning alpine scenery.",
    difficulty: "Moderate",
    groupSize: "Max 10 people",
  },
  {
    id: 3,
    title: "Japan Powder Skiing",
    location: "Japan",
    price: "$2,299",
    duration: "7 Days",
    rating: 4.9,
    image: "/skiing-snow-mountains-winter-sport.jpg",
    description: "Ski Japan's famous powder snow in world-renowned resorts.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 8 people",
  },
  {
    id: 4,
    title: "Canada Whistler Skiing",
    location: "Whistler, Canada",
    price: "$1,999",
    duration: "5 Days",
    rating: 4.8,
    image: "/skiing-snow-mountains-winter-sport.jpg",
    description: "Ski at one of North America's premier ski destinations.",
    difficulty: "Moderate",
    groupSize: "Max 12 people",
  },
]

const domesticSkiing = [
  {
    id: 5,
    title: "Gulmarg Skiing Adventure",
    location: "Jammu & Kashmir, India",
    price: "₹18,999",
    duration: "4 Days",
    rating: 4.9,
    image: "/skiing-snow-mountains-winter-sport.jpg",
    description: "Ski in Asia's largest ski resort with stunning Himalayan views.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 10 people",
  },
  {
    id: 6,
    title: "Manali Skiing Experience",
    location: "Himachal Pradesh, India",
    price: "₹12,999",
    duration: "3 Days",
    rating: 4.7,
    image: "/manali-himalayas-snow-mountains.jpg",
    description: "Learn to ski in the beautiful mountain town of Manali.",
    difficulty: "Easy to Moderate",
    groupSize: "Max 12 people",
  },
  {
    id: 7,
    title: "Auli Skiing Expedition",
    location: "Uttarakhand, India",
    price: "₹14,999",
    duration: "4 Days",
    rating: 4.8,
    image: "/skiing-snow-mountains-winter-sport.jpg",
    description: "Ski with panoramic views of Nanda Devi and surrounding peaks.",
    difficulty: "Moderate",
    groupSize: "Max 10 people",
  },
  {
    id: 8,
    title: "Solan Skiing & Snow Sports",
    location: "Himachal Pradesh, India",
    price: "₹9,999",
    duration: "3 Days",
    rating: 4.6,
    image: "/manali-mountains-snow-adventure-himachal.jpg",
    description: "Enjoy skiing and snow activities in the scenic hills of Solan.",
    difficulty: "Easy to Moderate",
    groupSize: "Max 12 people",
  },
]

export default function SkiingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "international" | "domestic">("all")
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const allActivities = [...internationalSkiing, ...domesticSkiing]
  const filteredActivities =
    activeTab === "all"
      ? allActivities
      : activeTab === "international"
        ? internationalSkiing
        : domesticSkiing

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
          <Snowflake className="w-3.5 h-3.5 text-white" />
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
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 rounded-full px-4 py-1.5 text-xs transition-all duration-300 hover:scale-105"
          >
            Book Now
          </Button>
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
              Skiing <span className="text-primary">Adventures</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Hit the slopes with professional skiing experiences in world-class destinations
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
              Found <span className="text-primary font-semibold">{filteredActivities.length}</span> skiing activities
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
              <p className="text-muted-foreground text-lg">No skiing activities found.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
