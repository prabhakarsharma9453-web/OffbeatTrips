"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { MapPin, DollarSign, Clock, Star, ArrowRight, Tent, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const internationalCampingActivities = [
  {
    id: 1,
    title: "Swiss Alps Camping Experience",
    location: "Switzerland, Europe",
    price: "$899",
    duration: "4 Days",
    rating: 4.8,
    image: "/camping-tent-nature-forest-night.jpg",
    description: "Camp under the stars in the Swiss Alps with stunning mountain views and pristine wilderness.",
    difficulty: "Moderate",
    groupSize: "Max 10 people",
  },
  {
    id: 2,
    title: "Norwegian Wilderness Camping",
    location: "Norway, Europe",
    price: "$1,099",
    duration: "5 Days",
    rating: 4.9,
    image: "/norway-fjords-beautiful-water-mountains.jpg",
    description: "Experience authentic camping in Norway's breathtaking fjords and pristine wilderness areas.",
    difficulty: "Moderate",
    groupSize: "Max 8 people",
  },
  {
    id: 3,
    title: "New Zealand Backcountry Camping",
    location: "New Zealand",
    price: "$1,299",
    duration: "6 Days",
    rating: 4.7,
    image: "/new-zealand-mountains-nature-scenic.jpg",
    description: "Explore New Zealand's stunning backcountry with guided camping adventures.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 12 people",
  },
  {
    id: 4,
    title: "Canadian Rockies Camping",
    location: "Canada, North America",
    price: "$1,199",
    duration: "5 Days",
    rating: 4.8,
    image: "/majestic-mountain-landscape-with-blue-sky-adventur.jpg",
    description: "Camp in the heart of the Canadian Rockies with incredible mountain scenery.",
    difficulty: "Moderate",
    groupSize: "Max 10 people",
  },
  {
    id: 5,
    title: "Australian Outback Camping",
    location: "Australia",
    price: "$1,399",
    duration: "7 Days",
    rating: 4.6,
    image: "/valley-hiking-adventure-green-mountains.jpg",
    description: "Experience the raw beauty of the Australian Outback with guided camping tours.",
    difficulty: "Moderate",
    groupSize: "Max 8 people",
  },
  {
    id: 6,
    title: "Patagonia Camping Adventure",
    location: "Argentina, South America",
    price: "$1,599",
    duration: "8 Days",
    rating: 4.9,
    image: "/swiss-alps-mountains-snow-travel.jpg",
    description: "Camp in the spectacular landscapes of Patagonia with glacier views and wildlife encounters.",
    difficulty: "Moderate to Difficult",
    groupSize: "Max 10 people",
  },
]

const domesticCampingActivities = [
  {
    id: 7,
    title: "Ladakh High Altitude Camping",
    location: "Ladakh, India",
    price: "₹15,999",
    duration: "5 Days",
    rating: 4.9,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    description: "Camp at high altitudes in Ladakh with stunning views of Pangong Lake and surrounding mountains.",
    difficulty: "Moderate",
    groupSize: "Max 12 people",
  },
  {
    id: 8,
    title: "Spiti Valley Camping Expedition",
    location: "Himachal Pradesh, India",
    price: "₹12,999",
    duration: "4 Days",
    rating: 4.8,
    image: "/manali-himalayas-snow-mountains.jpg",
    description: "Experience camping in the remote and beautiful Spiti Valley.",
    difficulty: "Moderate",
    groupSize: "Max 10 people",
  },
  {
    id: 9,
    title: "Rishikesh Riverside Camping",
    location: "Uttarakhand, India",
    price: "₹8,999",
    duration: "3 Days",
    rating: 4.7,
    image: "/camping-tent-nature-forest-night.jpg",
    description: "Camp by the Ganges River in Rishikesh with adventure activities included.",
    difficulty: "Easy to Moderate",
    groupSize: "Max 15 people",
  },
  {
    id: 10,
    title: "Coorg Jungle Camping",
    location: "Karnataka, India",
    price: "₹9,999",
    duration: "3 Days",
    rating: 4.6,
    image: "/valley-hiking-adventure-green-mountains.jpg",
    description: "Jungle camping experience in the beautiful coffee plantations of Coorg.",
    difficulty: "Easy",
    groupSize: "Max 12 people",
  },
  {
    id: 11,
    title: "Jaisalmer Desert Camping",
    location: "Rajasthan, India",
    price: "₹7,999",
    duration: "2 Days",
    rating: 4.8,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    description: "Experience magical desert camping in Jaisalmer with camel rides and cultural performances.",
    difficulty: "Easy",
    groupSize: "Max 20 people",
  },
  {
    id: 12,
    title: "Munnar Hill Station Camping",
    location: "Kerala, India",
    price: "₹6,999",
    duration: "3 Days",
    rating: 4.7,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    description: "Camp in the tea gardens of Munnar with beautiful hill station views.",
    difficulty: "Easy",
    groupSize: "Max 12 people",
  },
]

export default function CampingActivitiesPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "international" | "domestic">("all")
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const allActivities = [...internationalCampingActivities, ...domesticCampingActivities]
  const filteredActivities =
    activeTab === "all"
      ? allActivities
      : activeTab === "international"
        ? internationalCampingActivities
        : domesticCampingActivities

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
          <Tent className="w-3.5 h-3.5 text-white" />
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
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Camping <span className="text-primary">Adventures</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Experience the great outdoors with our curated camping adventures around the world
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
              Found <span className="text-primary font-semibold">{filteredActivities.length}</span> camping activities
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
              <p className="text-muted-foreground text-lg">No camping activities found.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
