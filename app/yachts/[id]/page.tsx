"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/loading-spinner"
import { ArrowLeft, Calendar, Users, DollarSign, Ship, Anchor, MapPin, Star, Check } from "lucide-react"

// Sample yacht data (in a real app, this would come from an API)
const yachtData: Record<number, any> = {
  1: {
    id: 1,
    name: "Ocean Dream",
    length: 180,
    pricePerNight: 25000,
    homeport: "Maldives",
    flag: "🇲🇻",
    crew: 12,
    size: 180,
    destination: "Maldives",
    images: [
      "/majestic-mountain-landscape-with-blue-sky-adventur.jpg",
      "/swiss-alps-mountains-snow-travel.jpg",
      "/camping-tent-nature-forest-night.jpg",
    ],
    amenities: ["Helipad", "Jacuzzi", "Gym", "Cinema", "Water Sports", "Diving", "Spa"],
    description:
      "Experience ultimate luxury aboard Ocean Dream, a magnificent 180ft superyacht designed for the most discerning travelers. With 12 crew members dedicated to your comfort, this vessel offers unparalleled service in the stunning waters of the Maldives.",
  },
}

export default function YachtBookingPage() {
  const params = useParams()
  const router = useRouter()
  const yachtId = parseInt(params?.id as string)
  const yacht = yachtData[yachtId]
  const [isLoading360, setIsLoading360] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    // Simulate 360° tour loading
    const timer = setTimeout(() => {
      setIsLoading360(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!yacht) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Yacht Not Found</h2>
            <Link href="/yachts">
              <Button>Back to Yachts</Button>
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
              Back to Yachts
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div>
              {/* Main Image / 360° Viewer */}
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 bg-card border border-border">
                {isLoading360 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading 360° Tour..." />
                  </div>
                ) : (
                  <>
                    <img
                      src={yacht.images[selectedImageIndex] || yacht.images[0]}
                      alt={yacht.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 z-10">
                      <span className="text-2xl">{yacht.flag}</span>
                      <span className="text-white text-sm font-medium">{yacht.homeport}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {yacht.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img src={image} alt={`${yacht.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">{yacht.name}</h1>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Ship className="w-5 h-5" />
                    <span>{yacht.length}ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{yacht.crew} Crew</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{yacht.homeport}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-3xl font-bold text-primary">${yacht.pricePerNight.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">per night</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-accent fill-accent" />
                    <span className="text-white font-semibold text-lg">4.9</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Select Dates
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className="px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="date"
                        className="px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Number of Guests
                    </label>
                    <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
                      {Array.from({ length: 19 }, (_, i) => i + 2).map((num) => (
                        <option key={num} value={num}>
                          {num} Guests
                        </option>
                      ))}
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
                <h2 className="text-2xl font-bold text-white mb-4">About {yacht.name}</h2>
                <p className="text-muted-foreground leading-relaxed">{yacht.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {yacht.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{amenity}</span>
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
