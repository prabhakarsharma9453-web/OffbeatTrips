"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { MapPin, DollarSign, Clock, Star, ArrowRight, Mountain, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const internationalHikingActivities = [
  {
    id: 1,
    title: "Swiss Alps Hiking Adventure",
    location: "Switzerland, Europe",
    price: "$1,299",
    duration: "5 Days",
    rating: 4.9,
    image: "/swiss-alps-mountains-snow-travel.jpg",
    description: "Experience the breathtaking beauty of the Swiss Alps with guided hiking trails through pristine mountain landscapes.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 12 people",
  },
  {
    id: 2,
    title: "Norwegian Fjords Trek",
    location: "Norway, Europe",
    price: "$1,499",
    duration: "7 Days",
    rating: 4.8,
    image: "/norway-fjords-beautiful-water-mountains.jpg",
    description: "Trek through Norway's stunning fjords and witness the Northern Lights on this unforgettable hiking adventure.",
    difficulty: "Moderate",
    groupSize: "Max 10 people",
  },
  {
    id: 3,
    title: "Nepal Everest Base Camp Trek",
    location: "Nepal, Asia",
    price: "$2,199",
    duration: "14 Days",
    rating: 4.9,
    image: "/beautiful-waterfall-nature-hiking.jpg",
    description: "Journey to the base of the world's highest peak through traditional Sherpa villages and stunning Himalayan vistas.",
    difficulty: "Difficult",
    groupSize: "Max 15 people",
  },
  {
    id: 4,
    title: "New Zealand Milford Track",
    location: "New Zealand, Oceania",
    price: "$1,799",
    duration: "4 Days",
    rating: 4.8,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    description: "Hike one of New Zealand's Great Walks through ancient rainforests, alpine passes, and pristine valleys.",
    difficulty: "Moderate",
    groupSize: "Max 12 people",
  },
  {
    id: 5,
    title: "Peru Inca Trail to Machu Picchu",
    location: "Peru, South America",
    price: "$2,499",
    duration: "5 Days",
    rating: 4.9,
    image: "/swiss-alps-mountains-snow-travel.jpg",
    description: "Follow the ancient Inca trail to the magnificent Machu Picchu, one of the world's most iconic hiking routes.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 16 people",
  },
  {
    id: 6,
    title: "Iceland Laugavegur Trail",
    location: "Iceland, Europe",
    price: "$1,899",
    duration: "6 Days",
    rating: 4.7,
    image: "/norway-fjords-beautiful-water-mountains.jpg",
    description: "Hike through Iceland's dramatic landscapes featuring glaciers, hot springs, and volcanic terrain.",
    difficulty: "Moderate",
    groupSize: "Max 10 people",
  },
]

const domesticHikingActivities = [
  {
    id: 7,
    title: "Ladakh Markha Valley Trek",
    location: "Ladakh, India",
    price: "₹35,999",
    duration: "8 Days",
    rating: 4.9,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    description: "Trek through the stunning Markha Valley in Ladakh, crossing high passes and visiting ancient monasteries.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 12 people",
  },
  {
    id: 8,
    title: "Himachal Pradesh Hampta Pass Trek",
    location: "Himachal Pradesh, India",
    price: "₹18,999",
    duration: "5 Days",
    rating: 4.8,
    image: "/manali-mountains-snow-adventure-himachal.jpg",
    description: "Cross the beautiful Hampta Pass from Kullu Valley to Lahaul, experiencing diverse landscapes and mountain views.",
    difficulty: "Moderate",
    groupSize: "Max 15 people",
  },
  {
    id: 9,
    title: "Uttarakhand Valley of Flowers Trek",
    location: "Uttarakhand, India",
    price: "₹22,999",
    duration: "6 Days",
    rating: 4.9,
    image: "/beautiful-waterfall-nature-hiking.jpg",
    description: "Walk through a carpet of vibrant alpine flowers in this UNESCO World Heritage Site surrounded by snow-capped peaks.",
    difficulty: "Moderate",
    groupSize: "Max 12 people",
  },
  {
    id: 10,
    title: "Karnataka Kudremukh Peak Trek",
    location: "Karnataka, India",
    price: "₹8,999",
    duration: "2 Days",
    rating: 4.7,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    description: "Trek to the highest peak in Karnataka through lush green meadows and dense forests in the Western Ghats.",
    difficulty: "Easy to Moderate",
    groupSize: "Max 20 people",
  },
  {
    id: 11,
    title: "Tamil Nadu Meesapulimala Trek",
    location: "Tamil Nadu, India",
    price: "₹12,999",
    duration: "3 Days",
    rating: 4.8,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    description: "Climb the second highest peak in the Western Ghats, offering panoramic views of tea plantations and misty valleys.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 15 people",
  },
  {
    id: 12,
    title: "Sikkim Goecha La Trek",
    location: "Sikkim, India",
    price: "₹45,999",
    duration: "10 Days",
    rating: 4.9,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    description: "Trek to Goecha La with stunning views of Mount Kanchenjunga, the third highest peak in the world.",
    difficulty: "Difficult",
    groupSize: "Max 10 people",
  },
]

export default function HikingActivitiesPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "international" | "domestic">("all")
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const allActivities = [...internationalHikingActivities, ...domesticHikingActivities]
  const filteredActivities =
    activeTab === "all"
      ? allActivities
      : activeTab === "international"
        ? internationalHikingActivities
        : domesticHikingActivities

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
              Found <span className="text-primary font-semibold">{filteredActivities.length}</span> hiking activities
            </p>
          </div>

          {/* Activities Grid */}
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
              <p className="text-muted-foreground text-lg">No hiking activities found.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
