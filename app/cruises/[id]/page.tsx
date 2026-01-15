"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Users, DollarSign, MapPin, Star, Ship, Check } from "lucide-react"

// Sample cruise data (in a real app, this would come from an API)
const cruiseData: Record<number, any> = {
  1: {
    id: 1,
    cruiseLine: "Silversea",
    shipName: "Silver Spirit",
    departurePort: "Barcelona, Spain",
    duration: 7,
    cabinType: "Owner Suite",
    pricePerPerson: 8500,
    images: [
      "/majestic-mountain-landscape-with-blue-sky-adventur.jpg",
      "/swiss-alps-mountains-snow-travel.jpg",
      "/camping-tent-nature-forest-night.jpg",
    ],
    itinerary: [
      { port: "Barcelona, Spain", day: 1, arrival: "6:00 PM" },
      { port: "Monaco", day: 2, arrival: "8:00 AM" },
      { port: "Portofino, Italy", day: 3, arrival: "9:00 AM" },
      { port: "Amalfi, Italy", day: 4, arrival: "8:00 AM" },
      { port: "Sicily, Italy", day: 5, arrival: "7:00 AM" },
      { port: "At Sea", day: 6, arrival: "-" },
      { port: "Barcelona, Spain", day: 7, arrival: "7:00 AM" },
    ],
    cabins: [
      { type: "Owner Suite", size: "1200 sq ft", capacity: 2, price: 8500 },
      { type: "Grand Suite", size: "1000 sq ft", capacity: 2, price: 7200 },
      { type: "Veranda Suite", size: "400 sq ft", capacity: 2, price: 5500 },
      { type: "Ocean View", size: "300 sq ft", capacity: 2, price: 4200 },
    ],
    amenities: ["Butler Service", "Fine Dining", "Spa", "Entertainment", "Excursions", "WiFi"],
    description:
      "Experience the ultimate in luxury cruising aboard Silver Spirit. With spacious suites, world-class dining, and impeccable service, this 7-night Mediterranean voyage offers an unforgettable journey through some of Europe's most beautiful ports.",
  },
}

export default function CruiseBookingPage() {
  const params = useParams()
  const cruiseId = parseInt(params?.id as string)
  const cruise = cruiseData[cruiseId]
  const [selectedCabin, setSelectedCabin] = useState(cruise?.cabins[0])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!cruise) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Cruise Not Found</h2>
            <Link href="/yachts">
              <Button>Back to Cruises</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/yachts">
            <Button variant="ghost" className="mb-8 text-white hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cruises
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div>
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 bg-card border border-border">
                <img
                  src={cruise.images[selectedImageIndex] || cruise.images[0]}
                  alt={cruise.shipName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full z-10">
                  <span className="text-white font-semibold">{cruise.cruiseLine}</span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {cruise.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img src={image} alt={`${cruise.shipName} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">{cruise.shipName}</h1>
                <div className="flex items-center gap-6 text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Ship className="w-5 h-5" />
                    <span>{cruise.cruiseLine}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{cruise.duration} nights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{cruise.departurePort}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-accent fill-accent" />
                  <span className="text-white font-semibold text-lg">4.8</span>
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Select Cabin</h2>
                <div className="space-y-3 mb-6">
                  {cruise.cabins.map((cabin: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedCabin(cabin)
                      }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedCabin?.type === cabin.type
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">{cabin.type}</h3>
                          <p className="text-sm text-muted-foreground">{cabin.size} • {cabin.capacity} guests</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">${cabin.price.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">per person</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Number of Guests
                    </label>
                    <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                    </select>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#B8941F] hover:to-[#D4AF37] text-black font-bold text-lg py-6 rounded-xl"
                  >
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">About {cruise.shipName}</h2>
                <p className="text-muted-foreground leading-relaxed">{cruise.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {cruise.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Itinerary</h2>
                <div className="space-y-3">
                  {cruise.itinerary.map((port: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-card/50 border border-border rounded-xl"
                    >
                      <div>
                        <p className="text-white font-semibold">{port.port}</p>
                        <p className="text-sm text-muted-foreground">Day {port.day}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">{port.arrival}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
