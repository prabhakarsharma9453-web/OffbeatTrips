"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, Clock, Star, ArrowRight, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// All available trips data organized by location
const allTripsByLocation: Record<string, any[]> = {
  Switzerland: [
    {
      id: 1,
      title: "Swiss Alps Explorer",
      location: "Switzerland",
      duration: "7 Days",
      price: "$2,499",
      rating: 4.9,
      image: "/swiss-alps-mountains-snow-travel.jpg",
      highlights: ["Mountain Hiking", "Scenic Train", "Glacier Walk"],
      mood: "Adventure",
      activities: ["Hiking", "Skiing", "Sightseeing"],
      type: "international",
    },
    {
      id: 11,
      title: "Swiss Winter Wonderland",
      location: "Switzerland",
      duration: "5 Days",
      price: "$2,199",
      rating: 4.8,
      image: "/switzerland-alps-beautiful-scenery.jpg",
      highlights: ["Skiing", "Ice Skating", "Alpine Views"],
      mood: "Adventure",
      activities: ["Skiing", "Hiking", "Sightseeing"],
      type: "international",
    },
    {
      id: 12,
      title: "Swiss Lakes & Cities",
      location: "Switzerland",
      duration: "6 Days",
      price: "$2,299",
      rating: 4.7,
      image: "/swiss-alps-hiking-trail-scenic.jpg",
      highlights: ["Lake Geneva", "Zurich", "Lucerne"],
      mood: "Relaxation",
      activities: ["Sightseeing", "Photography", "Cultural Tours"],
      type: "international",
    },
    {
      id: 13,
      title: "Jungfrau Region Adventure",
      location: "Switzerland",
      duration: "8 Days",
      price: "$2,899",
      rating: 4.9,
      image: "/swiss-alps-mountains-snow-travel.jpg",
      highlights: ["Jungfraujoch", "Interlaken", "Grindelwald"],
      mood: "Adventure",
      activities: ["Hiking", "Skiing", "Photography"],
      type: "international",
    },
    {
      id: 14,
      title: "Swiss Chocolate & Culture",
      location: "Switzerland",
      duration: "4 Days",
      price: "$1,899",
      rating: 4.6,
      image: "/switzerland-alps-beautiful-scenery.jpg",
      highlights: ["Chocolate Factory", "Bern", "Cultural Tours"],
      mood: "Cultural",
      activities: ["Sightseeing", "Photography", "Food Tours"],
      type: "international",
    },
    {
      id: 15,
      title: "Matterhorn Base Camp",
      location: "Switzerland",
      duration: "6 Days",
      price: "$2,599",
      rating: 4.8,
      image: "/swiss-alps-hiking-trail-scenic.jpg",
      highlights: ["Zermatt", "Matterhorn Views", "Alpine Hiking"],
      mood: "Adventure",
      activities: ["Hiking", "Photography", "Sightseeing"],
      type: "international",
    },
    {
      id: 16,
      title: "Swiss Countryside Retreat",
      location: "Switzerland",
      duration: "5 Days",
      price: "$2,099",
      rating: 4.7,
      image: "/swiss-alps-mountains-snow-travel.jpg",
      highlights: ["Countryside Villages", "Local Cuisine", "Peaceful Stay"],
      mood: "Relaxation",
      activities: ["Sightseeing", "Photography", "Cultural Tours"],
      type: "international",
    },
    {
      id: 17,
      title: "Bernina Express Journey",
      location: "Switzerland",
      duration: "7 Days",
      price: "$2,399",
      rating: 4.8,
      image: "/switzerland-alps-beautiful-scenery.jpg",
      highlights: ["Scenic Train", "Alpine Passes", "St. Moritz"],
      mood: "Adventure",
      activities: ["Sightseeing", "Photography", "Train Journey"],
      type: "international",
    },
    {
      id: 18,
      title: "Swiss Adventure Week",
      location: "Switzerland",
      duration: "9 Days",
      price: "$3,199",
      rating: 4.9,
      image: "/swiss-alps-hiking-trail-scenic.jpg",
      highlights: ["Multi-Day Hiking", "Mountain Peaks", "Alpine Lakes"],
      mood: "Adventure",
      activities: ["Hiking", "Camping", "Photography"],
      type: "international",
    },
    {
      id: 19,
      title: "Luxury Swiss Escape",
      location: "Switzerland",
      duration: "6 Days",
      price: "$4,499",
      rating: 5.0,
      image: "/swiss-alps-mountains-snow-travel.jpg",
      highlights: ["5-Star Hotels", "Private Tours", "Fine Dining"],
      mood: "Luxury",
      activities: ["Sightseeing", "Fine Dining", "Luxury Experiences"],
      type: "international",
    },
    {
      id: 20,
      title: "Swiss Photography Tour",
      location: "Switzerland",
      duration: "5 Days",
      price: "$2,299",
      rating: 4.7,
      image: "/switzerland-alps-beautiful-scenery.jpg",
      highlights: ["Best Photo Spots", "Sunrise/Sunset", "Landscape Photography"],
      mood: "Nature",
      activities: ["Photography", "Sightseeing", "Nature Tours"],
      type: "international",
    },
    {
      id: 21,
      title: "Swiss Family Adventure",
      location: "Switzerland",
      duration: "7 Days",
      price: "$2,799",
      rating: 4.8,
      image: "/swiss-alps-hiking-trail-scenic.jpg",
      highlights: ["Family-Friendly Activities", "Theme Parks", "Easy Hikes"],
      mood: "Family",
      activities: ["Sightseeing", "Family Activities", "Entertainment"],
      type: "international",
    },
  ],
  Norway: [
    {
      id: 2,
      title: "Norwegian Fjords",
      location: "Norway",
      duration: "6 Days",
      price: "$2,199",
      rating: 4.8,
      image: "/norway-fjords-beautiful-water-mountains.jpg",
      highlights: ["Fjord Cruise", "Northern Lights", "Ice Climbing"],
      mood: "Adventure",
      activities: ["Hiking", "Wildlife", "Photography"],
      type: "international",
    },
    {
      id: 22,
      title: "Lofoten Islands Adventure",
      location: "Norway",
      duration: "7 Days",
      price: "$2,499",
      rating: 4.9,
      image: "/norway-fjords-northern-lights.jpg",
      highlights: ["Fishing Villages", "Midnight Sun", "Arctic Beaches"],
      mood: "Adventure",
      activities: ["Hiking", "Photography", "Wildlife"],
      type: "international",
    },
    {
      id: 23,
      title: "Tromsø Northern Lights",
      location: "Norway",
      duration: "5 Days",
      price: "$2,099",
      rating: 4.8,
      image: "/norway-fjords-beautiful-water-mountains.jpg",
      highlights: ["Aurora Borealis", "Dog Sledding", "Snow Activities"],
      mood: "Adventure",
      activities: ["Wildlife", "Photography", "Winter Sports"],
      type: "international",
    },
    {
      id: 24,
      title: "Bergen & Fjords",
      location: "Norway",
      duration: "6 Days",
      price: "$2,299",
      rating: 4.7,
      image: "/norway-fjords-northern-lights.jpg",
      highlights: ["Bergen City", "Fjord Tours", "Flam Railway"],
      mood: "Relaxation",
      activities: ["Sightseeing", "Photography", "Cultural Tours"],
      type: "international",
    },
    {
      id: 25,
      title: "Oslo & Surroundings",
      location: "Norway",
      duration: "4 Days",
      price: "$1,899",
      rating: 4.6,
      image: "/norway-fjords-beautiful-water-mountains.jpg",
      highlights: ["Oslo Museums", "Viking History", "City Exploration"],
      mood: "Cultural",
      activities: ["Sightseeing", "Museums", "Cultural Tours"],
      type: "international",
    },
    {
      id: 26,
      title: "Trolltunga Hike",
      location: "Norway",
      duration: "5 Days",
      price: "$2,199",
      rating: 4.9,
      image: "/norway-fjords-northern-lights.jpg",
      highlights: ["Iconic Hike", "Mountain Views", "Adventure"],
      mood: "Adventure",
      activities: ["Hiking", "Photography", "Adventure"],
      type: "international",
    },
    {
      id: 27,
      title: "Arctic Circle Expedition",
      location: "Norway",
      duration: "8 Days",
      price: "$2,799",
      rating: 4.8,
      image: "/norway-fjords-beautiful-water-mountains.jpg",
      highlights: ["Arctic Circle", "Wildlife", "Midnight Sun"],
      mood: "Adventure",
      activities: ["Wildlife", "Photography", "Adventure"],
      type: "international",
    },
    {
      id: 28,
      title: "Norway Winter Wonder",
      location: "Norway",
      duration: "6 Days",
      price: "$2,399",
      rating: 4.7,
      image: "/norway-fjords-northern-lights.jpg",
      highlights: ["Winter Activities", "Snow Hotels", "Ice Fishing"],
      mood: "Adventure",
      activities: ["Winter Sports", "Wildlife", "Photography"],
      type: "international",
    },
  ],
  Ladakh: [
    {
      id: 4,
      title: "Ladakh Adventure",
      location: "Ladakh, India",
      duration: "8 Days",
      price: "₹45,999",
      rating: 4.9,
      image: "/ladakh-mountains-pangong-lake-adventure.jpg",
      highlights: ["Pangong Lake", "Nubra Valley", "Monastery Tour"],
      mood: "Adventure",
      activities: ["Hiking", "Camping", "Photography"],
      type: "domestic",
    },
    {
      id: 29,
      title: "Leh City & Monasteries",
      location: "Ladakh, India",
      duration: "5 Days",
      price: "₹32,999",
      rating: 4.8,
      image: "/ladakh-mountains-pangong-lake.jpg",
      highlights: ["Leh Palace", "Hemis Monastery", "Thiksey Monastery"],
      mood: "Cultural",
      activities: ["Sightseeing", "Photography", "Cultural Tours"],
      type: "domestic",
    },
    {
      id: 30,
      title: "Khardung La Pass",
      location: "Ladakh, India",
      duration: "6 Days",
      price: "₹38,999",
      rating: 4.9,
      image: "/ladakh-mountains-pangong-lake-adventure.jpg",
      highlights: ["World's Highest Motorable Road", "Nubra Valley", "Sand Dunes"],
      mood: "Adventure",
      activities: ["Road Trip", "Photography", "Adventure"],
      type: "domestic",
    },
    {
      id: 31,
      title: "Tso Moriri Lake",
      location: "Ladakh, India",
      duration: "7 Days",
      price: "₹42,999",
      rating: 4.8,
      image: "/ladakh-mountains-pangong-lake.jpg",
      highlights: ["High Altitude Lake", "Wildlife", "Camping"],
      mood: "Adventure",
      activities: ["Camping", "Wildlife", "Photography"],
      type: "domestic",
    },
    {
      id: 32,
      title: "Chadar Trek Experience",
      location: "Ladakh, India",
      duration: "9 Days",
      price: "₹55,999",
      rating: 4.9,
      image: "/ladakh-mountains-pangong-lake-adventure.jpg",
      highlights: ["Frozen River Trek", "Winter Adventure", "Unique Experience"],
      mood: "Adventure",
      activities: ["Hiking", "Adventure", "Winter Sports"],
      type: "domestic",
    },
    {
      id: 33,
      title: "Zanskar Valley",
      location: "Ladakh, India",
      duration: "8 Days",
      price: "₹48,999",
      rating: 4.8,
      image: "/ladakh-mountains-pangong-lake.jpg",
      highlights: ["Remote Valley", "Buddhist Culture", "Scenic Beauty"],
      mood: "Adventure",
      activities: ["Hiking", "Cultural Tours", "Photography"],
      type: "domestic",
    },
    {
      id: 34,
      title: "Ladakh Bike Tour",
      location: "Ladakh, India",
      duration: "10 Days",
      price: "₹52,999",
      rating: 4.9,
      image: "/ladakh-mountains-pangong-lake-adventure.jpg",
      highlights: ["Motorcycle Adventure", "High Passes", "Scenic Routes"],
      mood: "Adventure",
      activities: ["Adventure", "Road Trip", "Photography"],
      type: "domestic",
    },
    {
      id: 35,
      title: "Markha Valley Trek",
      location: "Ladakh, India",
      duration: "11 Days",
      price: "₹58,999",
      rating: 4.9,
      image: "/ladakh-mountains-pangong-lake.jpg",
      highlights: ["Classic Trek", "High Passes", "Villages"],
      mood: "Adventure",
      activities: ["Hiking", "Camping", "Photography"],
      type: "domestic",
    },
    {
      id: 36,
      title: "Hemis & Stok Trek",
      location: "Ladakh, India",
      duration: "7 Days",
      price: "₹44,999",
      rating: 4.7,
      image: "/ladakh-mountains-pangong-lake-adventure.jpg",
      highlights: ["Hemis Festival", "Stok Kangri Views", "Monasteries"],
      mood: "Cultural",
      activities: ["Hiking", "Cultural Tours", "Photography"],
      type: "domestic",
    },
    {
      id: 37,
      title: "Ladakh Photography",
      location: "Ladakh, India",
      duration: "8 Days",
      price: "₹46,999",
      rating: 4.8,
      image: "/ladakh-mountains-pangong-lake.jpg",
      highlights: ["Best Photo Spots", "Golden Hour", "Landscapes"],
      mood: "Nature",
      activities: ["Photography", "Sightseeing", "Nature Tours"],
      type: "domestic",
    },
    {
      id: 38,
      title: "Alchi & Likir",
      location: "Ladakh, India",
      duration: "6 Days",
      price: "₹36,999",
      rating: 4.6,
      image: "/ladakh-mountains-pangong-lake-adventure.jpg",
      highlights: ["Ancient Monasteries", "Indus Valley", "Buddhist Art"],
      mood: "Cultural",
      activities: ["Cultural Tours", "Sightseeing", "Photography"],
      type: "domestic",
    },
    {
      id: 39,
      title: "Ladakh Family Tour",
      location: "Ladakh, India",
      duration: "7 Days",
      price: "₹43,999",
      rating: 4.7,
      image: "/ladakh-mountains-pangong-lake.jpg",
      highlights: ["Family-Friendly", "Easy Routes", "Comfortable Stay"],
      mood: "Family",
      activities: ["Sightseeing", "Photography", "Family Activities"],
      type: "domestic",
    },
    {
      id: 40,
      title: "Three Lakes Tour",
      location: "Ladakh, India",
      duration: "9 Days",
      price: "₹51,999",
      rating: 4.9,
      image: "/ladakh-mountains-pangong-lake-adventure.jpg",
      highlights: ["Pangong", "Tso Moriri", "Tso Kar Lakes"],
      mood: "Adventure",
      activities: ["Sightseeing", "Photography", "Adventure"],
      type: "domestic",
    },
    {
      id: 41,
      title: "Ladakh Luxury Stay",
      location: "Ladakh, India",
      duration: "6 Days",
      price: "₹72,999",
      rating: 5.0,
      image: "/ladakh-mountains-pangong-lake.jpg",
      highlights: ["Luxury Camps", "Private Tours", "Premium Experience"],
      mood: "Luxury",
      activities: ["Luxury Experiences", "Sightseeing", "Fine Dining"],
      type: "domestic",
    },
    {
      id: 42,
      title: "Ladakh Winter",
      location: "Ladakh, India",
      duration: "8 Days",
      price: "₹47,999",
      rating: 4.8,
      image: "/ladakh-mountains-pangong-lake-adventure.jpg",
      highlights: ["Winter Landscapes", "Frozen Lakes", "Snow Activities"],
      mood: "Adventure",
      activities: ["Winter Sports", "Photography", "Adventure"],
      type: "domestic",
    },
  ],
  Thailand: [
    {
      id: 3,
      title: "Thailand Paradise",
      location: "Thailand",
      duration: "5 Days",
      price: "$1,299",
      rating: 4.7,
      image: "/thailand-beach-islands-tropical-paradise.jpg",
      highlights: ["Island Hopping", "Snorkeling", "Thai Cuisine"],
      mood: "Relaxation",
      activities: ["Swimming", "Water Sports", "Sightseeing"],
      type: "international",
    },
    {
      id: 43,
      title: "Bangkok City Explorer",
      location: "Thailand",
      duration: "4 Days",
      price: "$899",
      rating: 4.6,
      image: "/thailand-islands-beaches-tropical.jpg",
      highlights: ["Temples", "Street Food", "Shopping"],
      mood: "Cultural",
      activities: ["Sightseeing", "Food Tours", "Shopping"],
      type: "international",
    },
    {
      id: 44,
      title: "Phuket Beach Paradise",
      location: "Thailand",
      duration: "6 Days",
      price: "$1,499",
      rating: 4.8,
      image: "/thailand-beach-islands-tropical-paradise.jpg",
      highlights: ["Beach Resorts", "Water Activities", "Nightlife"],
      mood: "Relaxation",
      activities: ["Swimming", "Water Sports", "Entertainment"],
      type: "international",
    },
    {
      id: 45,
      title: "Chiang Mai Cultural",
      location: "Thailand",
      duration: "5 Days",
      price: "$1,199",
      rating: 4.7,
      image: "/thailand-islands-beaches-tropical.jpg",
      highlights: ["Ancient Temples", "Elephant Sanctuaries", "Thai Cooking"],
      mood: "Cultural",
      activities: ["Cultural Tours", "Wildlife", "Food Tours"],
      type: "international",
    },
    {
      id: 46,
      title: "Krabi Adventure",
      location: "Thailand",
      duration: "6 Days",
      price: "$1,399",
      rating: 4.9,
      image: "/thailand-beach-islands-tropical-paradise.jpg",
      highlights: ["Rock Climbing", "Island Tours", "Kayaking"],
      mood: "Adventure",
      activities: ["Rock Climbing", "Water Sports", "Adventure"],
      type: "international",
    },
    {
      id: 47,
      title: "Koh Samui Luxury",
      location: "Thailand",
      duration: "7 Days",
      price: "$2,299",
      rating: 4.8,
      image: "/thailand-islands-beaches-tropical.jpg",
      highlights: ["Luxury Resorts", "Spa Retreats", "Private Beaches"],
      mood: "Luxury",
      activities: ["Swimming", "Luxury Experiences", "Relaxation"],
      type: "international",
    },
    {
      id: 48,
      title: "Phi Phi Islands",
      location: "Thailand",
      duration: "5 Days",
      price: "$1,599",
      rating: 4.9,
      image: "/thailand-beach-islands-tropical-paradise.jpg",
      highlights: ["Maya Bay", "Snorkeling", "Island Hopping"],
      mood: "Adventure",
      activities: ["Water Sports", "Swimming", "Adventure"],
      type: "international",
    },
    {
      id: 49,
      title: "Ayutthaya Historical",
      location: "Thailand",
      duration: "4 Days",
      price: "$999",
      rating: 4.6,
      image: "/thailand-islands-beaches-tropical.jpg",
      highlights: ["Ancient Ruins", "UNESCO Sites", "Historical Tours"],
      mood: "Cultural",
      activities: ["Sightseeing", "Cultural Tours", "Photography"],
      type: "international",
    },
    {
      id: 50,
      title: "Thailand Family Fun",
      location: "Thailand",
      duration: "7 Days",
      price: "$1,799",
      rating: 4.7,
      image: "/thailand-beach-islands-tropical-paradise.jpg",
      highlights: ["Family Activities", "Theme Parks", "Beach Fun"],
      mood: "Family",
      activities: ["Family Activities", "Swimming", "Entertainment"],
      type: "international",
    },
    {
      id: 51,
      title: "Thailand Honeymoon",
      location: "Thailand",
      duration: "8 Days",
      price: "$2,499",
      rating: 4.9,
      image: "/thailand-islands-beaches-tropical.jpg",
      highlights: ["Romantic Resorts", "Private Dinners", "Sunset Cruises"],
      mood: "Romance",
      activities: ["Romantic Experiences", "Swimming", "Fine Dining"],
      type: "international",
    },
  ],
  "New Zealand": [
    {
      id: 52,
      title: "Auckland & Bay of Islands",
      location: "New Zealand",
      duration: "6 Days",
      price: "$2,299",
      rating: 4.8,
      image: "/new-zealand-mountains-nature-scenic.jpg",
      highlights: ["Harbor City", "Marine Activities", "Volcanic Islands"],
      mood: "Adventure",
      activities: ["Water Sports", "Sightseeing", "Adventure"],
      type: "international",
    },
    {
      id: 53,
      title: "Queenstown Adventure",
      location: "New Zealand",
      duration: "7 Days",
      price: "$2,499",
      rating: 4.9,
      image: "/valley-hiking-adventure-green-mountains.jpg",
      highlights: ["Bungee Jumping", "Milford Sound", "Adventure Sports"],
      mood: "Adventure",
      activities: ["Adventure", "Water Sports", "Photography"],
      type: "international",
    },
    {
      id: 54,
      title: "Rotorua & Geothermal",
      location: "New Zealand",
      duration: "5 Days",
      price: "$1,999",
      rating: 4.7,
      image: "/new-zealand-mountains-nature-scenic.jpg",
      highlights: ["Geysers", "Maori Culture", "Hot Springs"],
      mood: "Cultural",
      activities: ["Cultural Tours", "Sightseeing", "Nature Tours"],
      type: "international",
    },
    {
      id: 55,
      title: "Milford Track Trek",
      location: "New Zealand",
      duration: "6 Days",
      price: "$2,399",
      rating: 4.9,
      image: "/valley-hiking-adventure-green-mountains.jpg",
      highlights: ["Great Walk", "Fiordland", "Alpine Passes"],
      mood: "Adventure",
      activities: ["Hiking", "Nature Tours", "Photography"],
      type: "international",
    },
    {
      id: 56,
      title: "Wellington & Kapiti",
      location: "New Zealand",
      duration: "4 Days",
      price: "$1,699",
      rating: 4.6,
      image: "/new-zealand-mountains-nature-scenic.jpg",
      highlights: ["Capital City", "Museums", "Coastal Views"],
      mood: "Cultural",
      activities: ["Sightseeing", "Museums", "Cultural Tours"],
      type: "international",
    },
    {
      id: 57,
      title: "Dunedin & Otago",
      location: "New Zealand",
      duration: "5 Days",
      price: "$1,899",
      rating: 4.7,
      image: "/valley-hiking-adventure-green-mountains.jpg",
      highlights: ["Wildlife", "Historic Architecture", "Peninsula"],
      mood: "Nature",
      activities: ["Wildlife", "Sightseeing", "Photography"],
      type: "international",
    },
    {
      id: 58,
      title: "New Zealand Road Trip",
      location: "New Zealand",
      duration: "10 Days",
      price: "$3,499",
      rating: 4.9,
      image: "/new-zealand-mountains-nature-scenic.jpg",
      highlights: ["North & South Island", "Scenic Drives", "National Parks"],
      mood: "Adventure",
      activities: ["Road Trip", "Sightseeing", "Photography"],
      type: "international",
    },
    {
      id: 59,
      title: "Tongariro Alpine Crossing",
      location: "New Zealand",
      duration: "5 Days",
      price: "$2,099",
      rating: 4.8,
      image: "/valley-hiking-adventure-green-mountains.jpg",
      highlights: ["Volcanic Landscape", "One-Day Hike", "Mountain Views"],
      mood: "Adventure",
      activities: ["Hiking", "Adventure", "Photography"],
      type: "international",
    },
    {
      id: 60,
      title: "New Zealand Wildlife",
      location: "New Zealand",
      duration: "7 Days",
      price: "$2,599",
      rating: 4.8,
      image: "/new-zealand-mountains-nature-scenic.jpg",
      highlights: ["Penguins", "Seals", "Kiwi Birds"],
      mood: "Nature",
      activities: ["Wildlife", "Nature Tours", "Photography"],
      type: "international",
    },
  ],
  Manali: [
    {
      id: 6,
      title: "Manali Expedition",
      location: "Himachal Pradesh",
      duration: "4 Days",
      price: "₹18,999",
      rating: 4.7,
      image: "/manali-mountains-snow-adventure-himachal.jpg",
      highlights: ["Solang Valley", "Rohtang Pass", "River Rafting"],
      mood: "Adventure",
      activities: ["Hiking", "Skiing", "Water Sports"],
      type: "domestic",
    },
    {
      id: 61,
      title: "Manali Winter Wonder",
      location: "Himachal Pradesh",
      duration: "5 Days",
      price: "₹22,999",
      rating: 4.8,
      image: "/manali-himalayas-snow-mountains.jpg",
      highlights: ["Snow Activities", "Skiing", "Snowman Point"],
      mood: "Adventure",
      activities: ["Skiing", "Winter Sports", "Adventure"],
      type: "domestic",
    },
    {
      id: 62,
      title: "Hampta Pass Trek",
      location: "Himachal Pradesh",
      duration: "6 Days",
      price: "₹24,999",
      rating: 4.9,
      image: "/manali-mountains-snow-adventure-himachal.jpg",
      highlights: ["High Altitude Pass", "Chandratal Lake", "Mountain Views"],
      mood: "Adventure",
      activities: ["Hiking", "Camping", "Photography"],
      type: "domestic",
    },
    {
      id: 63,
      title: "Manali & Rohtang",
      location: "Himachal Pradesh",
      duration: "4 Days",
      price: "₹19,999",
      rating: 4.7,
      image: "/manali-himalayas-snow-mountains.jpg",
      highlights: ["Rohtang Pass", "Solang Valley", "Local Sightseeing"],
      mood: "Adventure",
      activities: ["Sightseeing", "Adventure", "Photography"],
      type: "domestic",
    },
    {
      id: 64,
      title: "Beas Kund Trek",
      location: "Himachal Pradesh",
      duration: "5 Days",
      price: "₹21,999",
      rating: 4.8,
      image: "/manali-mountains-snow-adventure-himachal.jpg",
      highlights: ["Glacier Lake", "Alpine Meadows", "Easy Trek"],
      mood: "Adventure",
      activities: ["Hiking", "Nature Tours", "Photography"],
      type: "domestic",
    },
    {
      id: 65,
      title: "Manali Family Package",
      location: "Himachal Pradesh",
      duration: "5 Days",
      price: "₹23,999",
      rating: 4.6,
      image: "/manali-himalayas-snow-mountains.jpg",
      highlights: ["Family Activities", "Comfortable Stay", "Easy Routes"],
      mood: "Family",
      activities: ["Family Activities", "Sightseeing", "Entertainment"],
      type: "domestic",
    },
    {
      id: 66,
      title: "Naggar & Kullu",
      location: "Himachal Pradesh",
      duration: "4 Days",
      price: "₹18,499",
      rating: 4.6,
      image: "/manali-mountains-snow-adventure-himachal.jpg",
      highlights: ["Naggar Castle", "Kullu Valley", "Cultural Sites"],
      mood: "Cultural",
      activities: ["Cultural Tours", "Sightseeing", "Photography"],
      type: "domestic",
    },
    {
      id: 67,
      title: "Jogini Falls & Vashisht",
      location: "Himachal Pradesh",
      duration: "3 Days",
      price: "₹15,999",
      rating: 4.5,
      image: "/manali-himalayas-snow-mountains.jpg",
      highlights: ["Waterfalls", "Hot Springs", "Temple Visit"],
      mood: "Relaxation",
      activities: ["Sightseeing", "Nature Tours", "Photography"],
      type: "domestic",
    },
    {
      id: 68,
      title: "Manali Adventure Sports",
      location: "Himachal Pradesh",
      duration: "5 Days",
      price: "₹26,999",
      rating: 4.8,
      image: "/manali-mountains-snow-adventure-himachal.jpg",
      highlights: ["Paragliding", "Ziplining", "River Rafting"],
      mood: "Adventure",
      activities: ["Adventure", "Water Sports", "Adventure Sports"],
      type: "domestic",
    },
    {
      id: 69,
      title: "Bijli Mahadev Trek",
      location: "Himachal Pradesh",
      duration: "4 Days",
      price: "₹19,499",
      rating: 4.7,
      image: "/manali-himalayas-snow-mountains.jpg",
      highlights: ["Temple Trek", "Panoramic Views", "Spiritual Experience"],
      mood: "Nature",
      activities: ["Hiking", "Cultural Tours", "Photography"],
      type: "domestic",
    },
    {
      id: 70,
      title: "Manali Summer Escape",
      location: "Himachal Pradesh",
      duration: "6 Days",
      price: "₹25,999",
      rating: 4.8,
      image: "/manali-mountains-snow-adventure-himachal.jpg",
      highlights: ["Cool Weather", "Mountain Views", "Relaxation"],
      mood: "Relaxation",
      activities: ["Sightseeing", "Nature Tours", "Photography"],
      type: "domestic",
    },
    {
      id: 71,
      title: "Chandrakhani Pass",
      location: "Himachal Pradesh",
      duration: "6 Days",
      price: "₹24,499",
      rating: 4.9,
      image: "/manali-himalayas-snow-mountains.jpg",
      highlights: ["High Pass", "Forest Trails", "Mountain Panoramas"],
      mood: "Adventure",
      activities: ["Hiking", "Camping", "Photography"],
      type: "domestic",
    },
    {
      id: 72,
      title: "Manali Photography Tour",
      location: "Himachal Pradesh",
      duration: "5 Days",
      price: "₹22,499",
      rating: 4.7,
      image: "/manali-mountains-snow-adventure-himachal.jpg",
      highlights: ["Best Photo Spots", "Sunrise/Sunset", "Landscapes"],
      mood: "Nature",
      activities: ["Photography", "Sightseeing", "Nature Tours"],
      type: "domestic",
    },
    {
      id: 73,
      title: "Kasol & Parvati Valley",
      location: "Himachal Pradesh",
      duration: "5 Days",
      price: "₹20,999",
      rating: 4.6,
      image: "/manali-himalayas-snow-mountains.jpg",
      highlights: ["Kasol Village", "Tosh", "Kalga Trek"],
      mood: "Adventure",
      activities: ["Hiking", "Cultural Tours", "Photography"],
      type: "domestic",
    },
    {
      id: 74,
      title: "Manali Luxury Stay",
      location: "Himachal Pradesh",
      duration: "6 Days",
      price: "₹45,999",
      rating: 4.9,
      image: "/manali-mountains-snow-adventure-himachal.jpg",
      highlights: ["5-Star Resorts", "Private Tours", "Fine Dining"],
      mood: "Luxury",
      activities: ["Luxury Experiences", "Sightseeing", "Fine Dining"],
      type: "domestic",
    },
    {
      id: 75,
      title: "Bhrigu Lake Trek",
      location: "Himachal Pradesh",
      duration: "4 Days",
      price: "₹21,499",
      rating: 4.8,
      image: "/manali-himalayas-snow-mountains.jpg",
      highlights: ["High Altitude Lake", "Alpine Meadows", "Mountain Views"],
      mood: "Adventure",
      activities: ["Hiking", "Camping", "Photography"],
      type: "domestic",
    },
    {
      id: 76,
      title: "Manali Honeymoon",
      location: "Himachal Pradesh",
      duration: "6 Days",
      price: "₹32,999",
      rating: 4.8,
      image: "/manali-mountains-snow-adventure-himachal.jpg",
      highlights: ["Romantic Stay", "Private Tours", "Sunset Views"],
      mood: "Romance",
      activities: ["Romantic Experiences", "Sightseeing", "Photography"],
      type: "domestic",
    },
    {
      id: 77,
      title: "Manali & Spiti",
      location: "Himachal Pradesh",
      duration: "8 Days",
      price: "₹38,999",
      rating: 4.9,
      image: "/manali-himalayas-snow-mountains.jpg",
      highlights: ["Spiti Valley", "Key Monastery", "High Altitude"],
      mood: "Adventure",
      activities: ["Road Trip", "Cultural Tours", "Photography"],
      type: "domestic",
    },
  ],
}

export default function DestinationTripsPage() {
  const params = useParams()
  const locationName = params?.location as string
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Get trips for this location - convert slug to display name
  // Convert "New-Zealand" to "New Zealand", "Switzerland" to "Switzerland", etc.
  const locationDisplayName = locationName
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
  const trips = allTripsByLocation[locationDisplayName || ""] || []

  const filteredTrips = trips.filter(
    (trip) =>
      !searchQuery ||
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const TripCard = ({ trip }: { trip: (typeof trips)[0] }) => (
    <div className="group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
      <div className="relative h-64 overflow-hidden">
        <img
          src={trip.image || "/placeholder.svg"}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-white text-sm font-semibold">{trip.rating}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            {trip.location}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{trip.title}</h3>
          <div className="flex flex-wrap gap-2">
            {trip.highlights.slice(0, 3).map((highlight, idx) => (
              <span key={idx} className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="w-4 h-4" />
            {trip.duration}
          </div>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{trip.mood}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {trip.activities.slice(0, 3).map((activity, idx) => (
            <span key={idx} className="text-xs bg-muted/80 backdrop-blur-sm px-3 py-1 rounded-full text-muted-foreground border border-border/50">
              {activity}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-2xl font-bold text-primary">{trip.price}</p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 rounded-full px-6 transition-all duration-300 hover:scale-105"
          >
            View Details
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
              {locationDisplayName} <span className="text-primary">Trips</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Discover {filteredTrips.length} amazing trips available in {locationDisplayName}
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-card border-border rounded-full text-white placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8 text-center">
            <p className="text-muted-foreground">
              Showing <span className="text-primary font-semibold">{filteredTrips.length}</span> of {trips.length} trips
            </p>
          </div>

          {/* Trips Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredTrips.map((trip, index) => (
                <div
                  key={trip.id}
                  className={isVisible ? "animate-fade-in-up" : "opacity-0"}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No trips found matching your search.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
