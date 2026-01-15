"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { MapPin, ArrowRight, Map } from "lucide-react"

const domesticDestinations = [
  { name: "Ladakh", state: "Jammu & Kashmir", trips: 15, image: "/ladakh-mountains-pangong-lake-adventure.jpg" },
  { name: "Kerala", state: "Kerala", trips: 18, image: "/kerala-backwaters-houseboat-beautiful-nature.jpg" },
  { name: "Manali", state: "Himachal Pradesh", trips: 12, image: "/manali-mountains-snow-adventure-himachal.jpg" },
  { name: "Goa", state: "Goa", trips: 20, image: "/thailand-beach-islands-tropical-paradise.jpg" },
  { name: "Rajasthan", state: "Rajasthan", trips: 16, image: "/coastal-hiking-beach-cliffs-adventure.jpg" },
  { name: "Rishikesh", state: "Uttarakhand", trips: 10, image: "/beautiful-waterfall-nature-hiking.jpg" },
  { name: "Darjeeling", state: "West Bengal", trips: 8, image: "/swiss-alps-mountains-snow-travel.jpg" },
  { name: "Shimla", state: "Himachal Pradesh", trips: 9, image: "/norway-fjords-beautiful-water-mountains.jpg" },
  { name: "Ooty", state: "Tamil Nadu", trips: 7, image: "/kerala-backwaters-houseboat-beautiful-nature.jpg" },
  { name: "Munnar", state: "Kerala", trips: 11, image: "/ladakh-mountains-pangong-lake-adventure.jpg" },
  { name: "Andaman", state: "Andaman & Nicobar", trips: 14, image: "/thailand-beach-islands-tropical-paradise.jpg" },
  { name: "Kashmir", state: "Jammu & Kashmir", trips: 13, image: "/swiss-alps-mountains-snow-travel.jpg" },
]

export default function DomesticDestinationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <Map className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-medium">100+ Domestic Destinations</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Explore <span className="text-primary">Domestic Destinations</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the incredible diversity of India with our curated selection of domestic destinations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domesticDestinations.map((destination, index) => (
              <Link
                key={index}
                href="/packages"
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="relative h-64">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      {destination.state}
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-1">{destination.name}</h3>
                    <p className="text-white/60 text-sm">{destination.trips} Trips Available</p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
