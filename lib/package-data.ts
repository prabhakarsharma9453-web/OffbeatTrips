export interface PackageItinerary {
  day: number
  title: string
  description: string
  activities: string[]
  meals?: string[]
}

export interface PackageDetails {
  slug: string
  title: string
  location: string
  country: string
  duration: string
  price: string
  rating: number
  reviewCount: number
  image: string
  images: string[]
  highlights: string[]
  activities: string[]
  type: "domestic" | "international"
  overview: string
  itinerary: PackageItinerary[]
  inclusions: string[]
  exclusions: string[]
  whyChoose: string[]
  whatsappMessage: string
  metaDescription?: string
}

export const packages: PackageDetails[] = [
  {
    slug: "classic-vietnam-package",
    title: "Classic Vietnam Package",
    location: "Hanoi, Ho Chi Minh City",
    country: "Vietnam",
    duration: "6 Days / 5 Nights",
    price: "₹49,999",
    rating: 4.8,
    reviewCount: 156,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    images: [
      "/thailand-beach-islands-tropical-paradise.jpg",
      "/coastal-hiking-beach-cliffs-adventure.jpg",
      "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    ],
    highlights: ["Halong Bay Cruise", "Ancient Temples", "Street Food Tours"],
    activities: ["Sightseeing", "Cultural Tours", "Photography"],
    type: "international",
    overview:
      "Discover the timeless charm of Vietnam with this classic journey through its most iconic destinations. From the bustling streets of Hanoi to the historic Cu Chi Tunnels in Ho Chi Minh City, experience the perfect blend of ancient culture and modern vibrancy. Cruise through the stunning limestone karsts of Halong Bay, explore ancient temples, and savor authentic Vietnamese cuisine.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Hanoi",
        description:
          "Welcome to Vietnam! Upon arrival at Noi Bai Airport, you'll be transferred to your hotel. After check-in, take a leisurely walk around the Old Quarter, known for its 36 ancient streets. Enjoy a traditional Vietnamese dinner at a local restaurant.",
        activities: ["Airport Transfer", "Hotel Check-in", "Old Quarter Walking Tour", "Welcome Dinner"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Halong Bay Cruise",
        description:
          "Early morning departure to Halong Bay, a UNESCO World Heritage Site. Board your luxury cruise ship and sail through thousands of limestone karsts and islets. Enjoy activities like kayaking, swimming, and visiting floating villages. Overnight on the cruise.",
        activities: ["Halong Bay Cruise", "Kayaking", "Swimming", "Cave Exploration"],
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Halong Bay to Hanoi",
        description:
          "Wake up to the serene beauty of Halong Bay. After breakfast, continue cruising and participate in a cooking class on board. Return to Hanoi in the afternoon. Evening free for shopping and exploring local markets.",
        activities: ["Sunrise Tai Chi", "Cooking Class", "Return to Hanoi", "Shopping"],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 4,
        title: "Hanoi to Ho Chi Minh City",
        description:
          "Morning flight to Ho Chi Minh City (Saigon). Visit the War Remnants Museum, Notre-Dame Cathedral, and the historic Central Post Office. Explore Ben Thanh Market for local souvenirs and street food.",
        activities: ["Flight to Ho Chi Minh", "City Tour", "Museum Visit", "Market Shopping"],
        meals: ["Breakfast"],
      },
      {
        day: 5,
        title: "Cu Chi Tunnels & Mekong Delta",
        description:
          "Visit the famous Cu Chi Tunnels, an extensive underground network used during the Vietnam War. In the afternoon, take a boat trip through the Mekong Delta, visit local villages, and enjoy fresh tropical fruits.",
        activities: ["Cu Chi Tunnels", "Mekong Delta Tour", "Village Visit", "Boat Ride"],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 6,
        title: "Departure",
        description:
          "After breakfast, enjoy some free time for last-minute shopping or relaxation. Transfer to Tan Son Nhat Airport for your departure flight, taking with you unforgettable memories of Vietnam.",
        activities: ["Free Time", "Airport Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "5 nights accommodation in 3-star hotels",
      "Daily breakfast",
      "All transfers and transportation",
      "Halong Bay cruise with meals",
      "Domestic flight (Hanoi to Ho Chi Minh)",
      "All entrance fees and sightseeing",
      "English-speaking guide",
      "Airport transfers",
    ],
    exclusions: [
      "International airfare",
      "Visa fees",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
      "Meals not mentioned",
      "Optional activities",
    ],
    whyChoose: [
      "Comprehensive itinerary covering Vietnam's top destinations",
      "Authentic cultural experiences and local interactions",
      "Comfortable accommodations in prime locations",
      "Expert local guides with deep knowledge",
      "Small group sizes for personalized attention",
      "Best value for money with all major attractions included",
    ],
    whatsappMessage: "Hi, I am interested in the Classic Vietnam Package",
    metaDescription:
      "Explore Vietnam's iconic destinations with our 6-day Classic Vietnam Package. Visit Hanoi, Halong Bay, and Ho Chi Minh City. Starting from ₹49,999 per person.",
  },
  {
    slug: "glorious-himachal-package",
    title: "Glorious Himachal Package",
    location: "Manali, Shimla",
    country: "India",
    duration: "5 Days / 4 Nights",
    price: "₹24,999",
    rating: 4.9,
    reviewCount: 203,
    image: "/manali-mountains-snow-adventure-himachal.jpg",
    images: [
      "/manali-mountains-snow-adventure-himachal.jpg",
      "/manali-himalayas-snow-mountains.jpg",
      "/swiss-alps-mountains-snow-travel.jpg",
    ],
    highlights: ["Snow-Capped Mountains", "Adventure Sports", "Hill Stations"],
    activities: ["Hiking", "Skiing", "Sightseeing"],
    type: "domestic",
    overview:
      "Experience the breathtaking beauty of Himachal Pradesh with this glorious package that takes you through the most scenic hill stations. From the adventure capital Manali to the colonial charm of Shimla, discover snow-capped peaks, lush valleys, and thrilling activities. Perfect for nature lovers and adventure enthusiasts.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Manali",
        description:
          "Arrive in Manali and check into your hotel. After freshening up, visit the famous Hadimba Temple, a beautiful wooden temple surrounded by cedar forests. Enjoy a stroll through the Mall Road and local markets.",
        activities: ["Hotel Check-in", "Hadimba Temple Visit", "Mall Road Shopping"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Solang Valley & Rohtang Pass",
        description:
          "Early morning drive to Solang Valley, known for adventure activities. Enjoy paragliding, zorbing, or skiing (seasonal). Later, visit Rohtang Pass for stunning mountain views and snow activities.",
        activities: ["Solang Valley", "Paragliding", "Rohtang Pass", "Snow Activities"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 3,
        title: "Manali to Shimla",
        description:
          "After breakfast, drive to Shimla, the Queen of Hills. En route, visit Kullu Valley and enjoy the scenic journey. Upon arrival, check into your hotel and explore the famous Mall Road and Ridge.",
        activities: ["Drive to Shimla", "Kullu Valley", "Mall Road", "Ridge Walk"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Shimla Sightseeing",
        description:
          "Full day exploring Shimla. Visit Christ Church, Jakhu Temple (famous for Hanuman statue), and the historic Viceregal Lodge. Take a ride on the UNESCO-listed Kalka-Shimla Toy Train. Evening free for shopping.",
        activities: ["Christ Church", "Jakhu Temple", "Viceregal Lodge", "Toy Train Ride"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 5,
        title: "Departure",
        description:
          "After breakfast, check out from the hotel. Transfer to the airport or railway station for your departure, carrying beautiful memories of the mountains.",
        activities: ["Hotel Check-out", "Departure Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "4 nights accommodation in 3-star hotels",
      "Daily breakfast and dinner",
      "All transfers and transportation",
      "Sightseeing as per itinerary",
      "Rohtang Pass permit",
      "Toy Train ride in Shimla",
      "Driver cum guide",
      "All tolls and parking charges",
    ],
    exclusions: [
      "Airfare or train tickets",
      "Adventure activity charges (paragliding, skiing, etc.)",
      "Lunch",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
      "Any additional activities",
    ],
    whyChoose: [
      "Perfect blend of adventure and relaxation",
      "Visit two most popular hill stations in one trip",
      "Stunning mountain views and natural beauty",
      "Comfortable accommodations with mountain views",
      "Flexible itinerary with optional activities",
      "Great value for families and couples",
    ],
    whatsappMessage: "Hi, I am interested in the Glorious Himachal Package",
    metaDescription:
      "Discover the beauty of Himachal Pradesh with our 5-day package covering Manali and Shimla. Adventure activities, snow-capped mountains, and hill stations. Starting from ₹24,999 per person.",
  },
  {
    slug: "amazing-bali-package",
    title: "Amazing Bali Package",
    location: "Bali, Indonesia",
    country: "Indonesia",
    duration: "5 Days / 4 Nights",
    price: "₹24,999",
    rating: 4.7,
    reviewCount: 189,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    images: [
      "/kerala-backwaters-houseboat-beautiful-nature.jpg",
      "/thailand-beach-islands-tropical-paradise.jpg",
      "/coastal-hiking-beach-cliffs-adventure.jpg",
    ],
    highlights: ["Temple Tours", "Beach Hopping", "Cultural Shows"],
    activities: ["Sightseeing", "Swimming", "Cultural Tours"],
    type: "international",
    overview:
      "Experience the Island of Gods with this amazing Bali package. From ancient temples to pristine beaches, from traditional dance performances to thrilling water sports, Bali offers something for everyone. Discover the unique Balinese culture, indulge in spa treatments, and relax on world-famous beaches.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bali",
        description:
          "Welcome to Bali! Upon arrival at Ngurah Rai Airport, transfer to your hotel in Seminyak or Ubud. After check-in, relax and enjoy the hotel facilities. Evening free to explore nearby areas.",
        activities: ["Airport Transfer", "Hotel Check-in", "Relaxation"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Ubud Cultural Tour",
        description:
          "Visit the famous Tegalalang Rice Terraces, Ubud Monkey Forest, and Tegenungan Waterfall. Explore Ubud Art Market and witness a traditional Balinese dance performance in the evening.",
        activities: ["Rice Terraces", "Monkey Forest", "Waterfall Visit", "Cultural Dance"],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 3,
        title: "Temple Tour & Beach",
        description:
          "Visit the iconic Tanah Lot Temple, perched on a rock formation. Then head to Uluwatu Temple for stunning cliff views and sunset. Enjoy a seafood dinner at Jimbaran Beach.",
        activities: ["Tanah Lot Temple", "Uluwatu Temple", "Sunset Viewing", "Beach Dinner"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Water Sports & Leisure",
        description:
          "Full day at Nusa Dua or Tanjung Benoa for water sports activities like parasailing, jet skiing, and banana boat rides. Alternatively, enjoy spa treatments or relax at the beach.",
        activities: ["Water Sports", "Beach Activities", "Spa (Optional)"],
        meals: ["Breakfast"],
      },
      {
        day: 5,
        title: "Departure",
        description:
          "After breakfast, check out from the hotel. Depending on your flight time, enjoy some last-minute shopping or relaxation. Transfer to the airport for your departure.",
        activities: ["Hotel Check-out", "Shopping (Optional)", "Airport Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "4 nights accommodation in 3-star hotels",
      "Daily breakfast",
      "All transfers and transportation",
      "Sightseeing as per itinerary",
      "Cultural dance show tickets",
      "Entrance fees to temples and attractions",
      "English-speaking guide",
      "Airport transfers",
    ],
    exclusions: [
      "International airfare",
      "Visa on arrival fees",
      "Water sports activities",
      "Spa treatments",
      "Lunch and dinner (except mentioned)",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
    ],
    whyChoose: [
      "Perfect mix of culture, nature, and adventure",
      "Visit iconic temples and rice terraces",
      "Beautiful beaches and water activities",
      "Authentic Balinese cultural experiences",
      "Flexible itinerary with optional activities",
      "Great value for money",
    ],
    whatsappMessage: "Hi, I am interested in the Amazing Bali Package",
    metaDescription:
      "Discover the beauty of Bali with our 5-day package. Visit temples, rice terraces, beaches, and enjoy cultural shows. Starting from ₹24,999 per person.",
  },
  {
    slug: "explore-sri-lanka-package",
    title: "Explore Sri Lanka Package",
    location: "Colombo, Kandy, Nuwara Eliya",
    country: "Sri Lanka",
    duration: "6 Days / 5 Nights",
    price: "₹30,999",
    rating: 4.8,
    reviewCount: 142,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    images: [
      "/thailand-beach-islands-tropical-paradise.jpg",
      "/kerala-backwaters-houseboat-beautiful-nature.jpg",
      "/coastal-hiking-beach-cliffs-adventure.jpg",
    ],
    highlights: ["Tea Plantations", "Wildlife Safari", "Ancient Cities"],
    activities: ["Sightseeing", "Wildlife", "Photography"],
    type: "international",
    overview:
      "Explore the Pearl of the Indian Ocean with this comprehensive Sri Lanka package. From the bustling capital Colombo to the hill country tea plantations, from ancient cities to wildlife safaris, experience the diverse beauty and rich culture of this tropical paradise.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Colombo",
        description:
          "Arrive at Bandaranaike International Airport and transfer to your hotel in Colombo. After check-in, take a city tour visiting Gangaramaya Temple, Independence Square, and Galle Face Green. Enjoy a traditional Sri Lankan dinner.",
        activities: ["Airport Transfer", "City Tour", "Temple Visit"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Colombo to Kandy",
        description:
          "Drive to Kandy, the cultural capital. Visit the Temple of the Sacred Tooth Relic, one of the most sacred Buddhist sites. Enjoy a cultural dance show in the evening. Explore Kandy Market.",
        activities: ["Drive to Kandy", "Temple Visit", "Cultural Show", "Market Visit"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 3,
        title: "Kandy to Nuwara Eliya",
        description:
          "Visit a tea plantation and factory to learn about Ceylon tea production. Drive through scenic hills to Nuwara Eliya, known as Little England. Visit Gregory Lake and enjoy the cool climate.",
        activities: ["Tea Plantation", "Tea Factory Tour", "Nuwara Eliya", "Lake Visit"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Yala National Park Safari",
        description:
          "Early morning drive to Yala National Park for a wildlife safari. Spot elephants, leopards, crocodiles, and various bird species. After the safari, drive to the beach town of Bentota.",
        activities: ["Wildlife Safari", "Animal Spotting", "Beach Transfer"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 5,
        title: "Bentota Beach & Galle",
        description:
          "Enjoy water sports at Bentota Beach or relax by the ocean. Visit the historic Galle Fort, a UNESCO World Heritage Site. Explore the Dutch colonial architecture and enjoy sunset views.",
        activities: ["Beach Activities", "Water Sports", "Galle Fort", "Sunset Viewing"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 6,
        title: "Departure",
        description:
          "After breakfast, transfer to the airport for your departure flight, taking with you beautiful memories of Sri Lanka's diverse landscapes and rich culture.",
        activities: ["Hotel Check-out", "Airport Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "5 nights accommodation in 3-star hotels",
      "Daily breakfast and dinner",
      "All transfers and transportation",
      "Yala National Park safari",
      "Cultural dance show in Kandy",
      "Tea factory visit",
      "All entrance fees",
      "English-speaking guide",
      "Airport transfers",
    ],
    exclusions: [
      "International airfare",
      "Visa fees",
      "Lunch",
      "Water sports activities",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
      "Optional activities",
    ],
    whyChoose: [
      "Comprehensive tour covering major attractions",
      "Wildlife safari experience in Yala",
      "Tea plantation and cultural experiences",
      "Beautiful beaches and hill stations",
      "Rich cultural heritage sites",
      "Excellent value for money",
    ],
    whatsappMessage: "Hi, I am interested in the Explore Sri Lanka Package",
    metaDescription:
      "Discover Sri Lanka with our 6-day package covering Colombo, Kandy, tea plantations, wildlife safari, and beaches. Starting from ₹30,999 per person.",
  },
  {
    slug: "rajasthan-wildlife-package",
    title: "Rajasthan Wildlife Package",
    location: "Ranthambore, Bharatpur",
    country: "India",
    duration: "4 Days / 3 Nights",
    price: "₹19,999",
    rating: 4.6,
    reviewCount: 98,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    images: [
      "/ladakh-mountains-pangong-lake-adventure.jpg",
      "/manali-mountains-snow-adventure-himachal.jpg",
      "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    ],
    highlights: ["Tiger Safari", "Bird Watching", "Historic Forts"],
    activities: ["Wildlife", "Photography", "Sightseeing"],
    type: "domestic",
    overview:
      "Embark on an exciting wildlife adventure in Rajasthan with this specially curated package. Experience thrilling tiger safaris in Ranthambore National Park, bird watching at Bharatpur Bird Sanctuary, and explore historic forts. Perfect for wildlife enthusiasts and nature photographers.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Ranthambore",
        description:
          "Arrive at Jaipur or Sawai Madhopur railway station and transfer to your hotel in Ranthambore. After check-in, visit the historic Ranthambore Fort, which offers panoramic views of the national park. Evening free for relaxation.",
        activities: ["Transfer to Ranthambore", "Hotel Check-in", "Fort Visit"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Ranthambore Safari",
        description:
          "Early morning jeep safari in Ranthambore National Park, one of the best places to spot tigers in the wild. Spot various wildlife including deer, monkeys, crocodiles, and if lucky, the majestic Royal Bengal Tiger. Afternoon safari for another chance to see wildlife.",
        activities: ["Morning Safari", "Wildlife Spotting", "Afternoon Safari", "Photography"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 3,
        title: "Ranthambore to Bharatpur",
        description:
          "After breakfast, drive to Bharatpur. Visit Keoladeo National Park (Bharatpur Bird Sanctuary), a UNESCO World Heritage Site. Take a cycle rickshaw ride through the park to spot hundreds of bird species including migratory birds.",
        activities: ["Drive to Bharatpur", "Bird Sanctuary Visit", "Bird Watching", "Cycle Rickshaw"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Departure",
        description:
          "Early morning bird watching session (optional). After breakfast, check out and transfer to Agra or Delhi for your departure, carrying unforgettable wildlife memories.",
        activities: ["Bird Watching (Optional)", "Hotel Check-out", "Departure Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "3 nights accommodation in wildlife resorts",
      "Daily breakfast and dinner",
      "All transfers and transportation",
      "Two jeep safaris in Ranthambore",
      "Bharatpur Bird Sanctuary entry",
      "Cycle rickshaw ride",
      "Ranthambore Fort visit",
      "Driver cum guide",
      "All park fees and permits",
    ],
    exclusions: [
      "Train or flight tickets",
      "Lunch",
      "Camera fees",
      "Additional safari charges",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
      "Optional activities",
    ],
    whyChoose: [
      "Best tiger spotting opportunities",
      "UNESCO World Heritage bird sanctuary",
      "Expert naturalist guides",
      "Comfortable wildlife resort stays",
      "Perfect for wildlife photography",
      "Great value for wildlife enthusiasts",
    ],
    whatsappMessage: "Hi, I am interested in the Rajasthan Wildlife Package",
    metaDescription:
      "Experience thrilling wildlife safaris in Ranthambore and bird watching in Bharatpur. 4-day package starting from ₹19,999 per person.",
  },
  {
    slug: "stunning-phuket-krabi-package",
    title: "Stunning Phuket and Krabi Package",
    location: "Phuket, Krabi",
    country: "Thailand",
    duration: "5 Days / 4 Nights",
    price: "₹25,999",
    rating: 4.9,
    reviewCount: 221,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    images: [
      "/thailand-beach-islands-tropical-paradise.jpg",
      "/thailand-islands-beaches-tropical.jpg",
      "/coastal-hiking-beach-cliffs-adventure.jpg",
    ],
    highlights: ["Island Hopping", "Crystal Clear Waters", "Limestone Karsts"],
    activities: ["Swimming", "Snorkeling", "Water Sports"],
    type: "international",
    overview:
      "Discover the stunning beauty of Thailand's Andaman coast with this amazing package covering Phuket and Krabi. From pristine beaches to dramatic limestone cliffs, from vibrant nightlife to peaceful islands, experience the best of both destinations in one incredible journey.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Phuket",
        description:
          "Arrive at Phuket International Airport and transfer to your hotel. After check-in, relax at the beach or explore Patong Beach area. Enjoy the vibrant nightlife and street food in the evening.",
        activities: ["Airport Transfer", "Hotel Check-in", "Beach Relaxation", "Nightlife"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Phi Phi Islands Tour",
        description:
          "Full-day speedboat tour to Phi Phi Islands. Visit Maya Bay (made famous by 'The Beach'), snorkel in crystal-clear waters, and enjoy lunch on the boat. Visit Monkey Beach and Viking Cave.",
        activities: ["Phi Phi Islands", "Snorkeling", "Maya Bay", "Monkey Beach"],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 3,
        title: "Phuket to Krabi",
        description:
          "After breakfast, transfer to Krabi. Check into your hotel and visit the famous Railay Beach, accessible only by boat. Enjoy rock climbing or relax on the pristine beach. Visit Phra Nang Cave Beach.",
        activities: ["Transfer to Krabi", "Railay Beach", "Rock Climbing (Optional)", "Cave Beach"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Four Islands Tour",
        description:
          "Full-day boat tour to the Four Islands: Chicken Island, Tup Island, Poda Island, and Phra Nang Cave. Enjoy snorkeling, swimming, and beach hopping. Witness the unique sandbar connecting islands at low tide.",
        activities: ["Four Islands Tour", "Snorkeling", "Beach Hopping", "Swimming"],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 5,
        title: "Departure",
        description:
          "After breakfast, check out from the hotel. Depending on your flight, enjoy some last-minute shopping or beach time. Transfer to Krabi or Phuket airport for your departure.",
        activities: ["Hotel Check-out", "Shopping (Optional)", "Airport Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "4 nights accommodation in 3-star beachfront hotels",
      "Daily breakfast",
      "All transfers and transportation",
      "Phi Phi Islands speedboat tour with lunch",
      "Four Islands tour with lunch",
      "All entrance fees",
      "English-speaking guide",
      "Airport transfers",
    ],
    exclusions: [
      "International airfare",
      "Visa on arrival fees",
      "Water sports activities",
      "Rock climbing charges",
      "Dinner (except day 1)",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
    ],
    whyChoose: [
      "Visit two most beautiful beach destinations",
      "Iconic Phi Phi Islands included",
      "Crystal-clear waters perfect for snorkeling",
      "Stunning limestone karst formations",
      "Flexible with optional activities",
      "Excellent value for beach lovers",
    ],
    whatsappMessage: "Hi, I am interested in the Stunning Phuket and Krabi Package",
    metaDescription:
      "Explore Phuket and Krabi with island hopping, snorkeling, and beautiful beaches. 5-day package starting from ₹25,999 per person.",
  },
  {
    slug: "kashmir-special-package",
    title: "Kashmir Special Package",
    location: "Srinagar, Gulmarg, Pahalgam",
    country: "India",
    duration: "5 Days / 4 Nights",
    price: "₹18,999",
    rating: 4.9,
    reviewCount: 267,
    image: "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    images: [
      "/kerala-backwaters-houseboat-beautiful-nature.jpg",
      "/manali-mountains-snow-adventure-himachal.jpg",
      "/swiss-alps-mountains-snow-travel.jpg",
    ],
    highlights: ["Houseboat Stay", "Gulmarg Gondola", "Dal Lake"],
    activities: ["Sightseeing", "Photography", "Boating"],
    type: "domestic",
    overview:
      "Experience the paradise on earth with this special Kashmir package. Stay in traditional houseboats on Dal Lake, ride the famous Gulmarg Gondola, and explore the breathtaking valleys of Pahalgam. This package offers the perfect blend of natural beauty, adventure, and cultural experiences.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar",
        description:
          "Arrive in Srinagar and transfer to your houseboat on Dal Lake. After check-in, enjoy a shikara ride on the lake, visiting floating gardens and local markets. Experience the unique houseboat stay with traditional Kashmiri dinner.",
        activities: ["Airport Transfer", "Houseboat Check-in", "Shikara Ride", "Floating Gardens"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Srinagar to Gulmarg",
        description:
          "Drive to Gulmarg, the Meadow of Flowers. Take the famous Gulmarg Gondola (cable car) to reach the highest point for panoramic views of snow-capped peaks. Enjoy activities like skiing (seasonal) or simply enjoy the scenic beauty.",
        activities: ["Drive to Gulmarg", "Gondola Ride", "Mountain Views", "Skiing (Seasonal)"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 3,
        title: "Gulmarg to Pahalgam",
        description:
          "After breakfast, drive to Pahalgam, known as the Valley of Shepherds. Visit Betaab Valley and Aru Valley, famous for their scenic beauty. Enjoy horse riding or trekking in the meadows.",
        activities: ["Drive to Pahalgam", "Betaab Valley", "Aru Valley", "Horse Riding"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Pahalgam to Srinagar",
        description:
          "Return to Srinagar. Visit the famous Mughal Gardens - Nishat Bagh and Shalimar Bagh. Explore local handicraft markets and enjoy shopping for Kashmiri shawls, carpets, and souvenirs.",
        activities: ["Return to Srinagar", "Mughal Gardens", "Shopping", "Local Markets"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 5,
        title: "Departure",
        description:
          "After breakfast, enjoy a final shikara ride on Dal Lake. Check out from the houseboat and transfer to the airport for your departure, carrying beautiful memories of Kashmir.",
        activities: ["Final Shikara Ride", "Houseboat Check-out", "Airport Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "1 night houseboat stay on Dal Lake",
      "3 nights accommodation in 3-star hotels",
      "Daily breakfast and dinner",
      "All transfers and transportation",
      "Gulmarg Gondola ride",
      "Shikara rides on Dal Lake",
      "All sightseeing as per itinerary",
      "Driver cum guide",
      "Airport transfers",
    ],
    exclusions: [
      "Airfare or train tickets",
      "Lunch",
      "Horse riding charges",
      "Skiing equipment and charges",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
      "Optional activities",
    ],
    whyChoose: [
      "Unique houseboat experience on Dal Lake",
      "Famous Gulmarg Gondola ride included",
      "Visit three most beautiful destinations",
      "Stunning natural beauty throughout",
      "Authentic Kashmiri cultural experience",
      "Best value for Kashmir tour",
    ],
    whatsappMessage: "Hi, I am interested in the Kashmir Special Package",
    metaDescription:
      "Experience paradise on earth with houseboat stay, Gulmarg Gondola, and beautiful valleys. 5-day Kashmir package starting from ₹18,999 per person.",
  },
  {
    slug: "exclusive-dubai-package",
    title: "Exclusive Dubai Package",
    location: "Dubai, UAE",
    country: "UAE",
    duration: "4 Days / 3 Nights",
    price: "₹24,999",
    rating: 4.8,
    reviewCount: 198,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    images: [
      "/thailand-beach-islands-tropical-paradise.jpg",
      "/coastal-hiking-beach-cliffs-adventure.jpg",
      "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    ],
    highlights: ["Burj Khalifa", "Desert Safari", "Luxury Shopping"],
    activities: ["Sightseeing", "Shopping", "Adventure"],
    type: "international",
    overview:
      "Experience the luxury and opulence of Dubai with this exclusive package. From the world's tallest building to thrilling desert safaris, from luxury shopping malls to traditional souks, discover the perfect blend of modern marvels and traditional Arabian culture.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Dubai",
        description:
          "Arrive at Dubai International Airport and transfer to your hotel. After check-in, visit the iconic Burj Khalifa and enjoy the view from the observation deck. Evening visit to Dubai Mall and watch the famous Dubai Fountain show.",
        activities: ["Airport Transfer", "Hotel Check-in", "Burj Khalifa", "Dubai Fountain"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "City Tour & Desert Safari",
        description:
          "Morning city tour visiting Jumeirah Mosque, Palm Jumeirah, and Atlantis Hotel. Afternoon desert safari with dune bashing, camel riding, and traditional BBQ dinner with belly dance show under the stars.",
        activities: ["City Tour", "Desert Safari", "Dune Bashing", "Camel Ride", "Cultural Show"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 3,
        title: "Abu Dhabi Day Trip",
        description:
          "Full-day trip to Abu Dhabi. Visit the magnificent Sheikh Zayed Grand Mosque, Ferrari World (optional), and Yas Island. Return to Dubai in the evening for shopping at Gold Souk and Spice Souk.",
        activities: ["Abu Dhabi Tour", "Grand Mosque", "Ferrari World (Optional)", "Shopping"],
        meals: ["Breakfast"],
      },
      {
        day: 4,
        title: "Departure",
        description:
          "After breakfast, enjoy some last-minute shopping or visit Dubai Marina. Check out from the hotel and transfer to the airport for your departure, taking with you memories of Dubai's luxury and grandeur.",
        activities: ["Shopping", "Dubai Marina (Optional)", "Hotel Check-out", "Airport Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "3 nights accommodation in 3-star hotels",
      "Daily breakfast",
      "All transfers and transportation",
      "Burj Khalifa observation deck ticket",
      "Desert safari with BBQ dinner",
      "Abu Dhabi day trip",
      "City tour",
      "English-speaking guide",
      "Airport transfers",
    ],
    exclusions: [
      "International airfare",
      "Visa fees",
      "Lunch and dinner (except mentioned)",
      "Ferrari World tickets",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
      "Optional activities",
    ],
    whyChoose: [
      "Visit world's tallest building",
      "Thrilling desert safari experience",
      "Luxury shopping opportunities",
      "Modern architecture and attractions",
      "Perfect blend of culture and adventure",
      "Great value for Dubai experience",
    ],
    whatsappMessage: "Hi, I am interested in the Exclusive Dubai Package",
    metaDescription:
      "Experience Dubai's luxury with Burj Khalifa, desert safari, and shopping. 4-day package starting from ₹24,999 per person.",
  },
  {
    slug: "splendid-turkiye-package",
    title: "Splendid Turkiye Package",
    location: "Istanbul, Cappadocia",
    country: "Turkey",
    duration: "7 Days / 6 Nights",
    price: "₹79,999",
    rating: 4.9,
    reviewCount: 134,
    image: "/coastal-hiking-beach-cliffs-adventure.jpg",
    images: [
      "/coastal-hiking-beach-cliffs-adventure.jpg",
      "/thailand-beach-islands-tropical-paradise.jpg",
      "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    ],
    highlights: ["Hot Air Balloon", "Historic Mosques", "Underground Cities"],
    activities: ["Sightseeing", "Cultural Tours", "Adventure"],
    type: "international",
    overview:
      "Discover the splendid beauty of Turkey with this comprehensive package covering Istanbul and Cappadocia. From historic mosques and palaces to unique rock formations and hot air balloon rides, experience the rich history and stunning landscapes of this transcontinental country.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Istanbul",
        description:
          "Arrive at Istanbul Airport and transfer to your hotel. After check-in, take a Bosphorus cruise to see the city from the water, passing between Europe and Asia. Evening free to explore the area.",
        activities: ["Airport Transfer", "Hotel Check-in", "Bosphorus Cruise"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Istanbul City Tour",
        description:
          "Full-day city tour visiting the iconic Hagia Sophia, Blue Mosque, Topkapi Palace, and Grand Bazaar. Explore the historic Sultanahmet area and enjoy traditional Turkish cuisine.",
        activities: ["Hagia Sophia", "Blue Mosque", "Topkapi Palace", "Grand Bazaar"],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 3,
        title: "Istanbul to Cappadocia",
        description:
          "Morning flight to Cappadocia. Upon arrival, check into your cave hotel. Visit the Open Air Museum with rock-cut churches and frescoes. Enjoy the unique cave hotel experience.",
        activities: ["Flight to Cappadocia", "Cave Hotel Check-in", "Open Air Museum"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Cappadocia Hot Air Balloon & Tour",
        description:
          "Early morning hot air balloon ride over the fairy chimneys (weather permitting). After breakfast, visit the underground city, Pigeon Valley, and Uchisar Castle. Enjoy pottery demonstration and Turkish night show.",
        activities: ["Hot Air Balloon", "Underground City", "Valley Tours", "Cultural Show"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 5,
        title: "Cappadocia Exploration",
        description:
          "Visit Devrent Valley (Imagination Valley), Avanos pottery village, and Love Valley. Enjoy ATV tour or horse riding. Experience traditional Turkish hammam (optional).",
        activities: ["Valley Tours", "Pottery Village", "ATV Tour", "Hammam (Optional)"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 6,
        title: "Cappadocia to Istanbul",
        description:
          "Morning flight back to Istanbul. Visit Spice Bazaar and enjoy a Turkish coffee experience. Evening free for shopping or exploring Taksim Square and Istiklal Avenue.",
        activities: ["Flight to Istanbul", "Spice Bazaar", "Turkish Coffee", "Shopping"],
        meals: ["Breakfast"],
      },
      {
        day: 7,
        title: "Departure",
        description:
          "After breakfast, check out from the hotel. Depending on your flight time, enjoy some last-minute shopping. Transfer to the airport for your departure.",
        activities: ["Hotel Check-out", "Shopping (Optional)", "Airport Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "6 nights accommodation (3-star hotels + cave hotel)",
      "Daily breakfast",
      "All transfers and transportation",
      "Domestic flights (Istanbul-Cappadocia-Istanbul)",
      "Hot air balloon ride in Cappadocia",
      "All entrance fees and sightseeing",
      "Bosphorus cruise",
      "Turkish night show",
      "English-speaking guide",
      "Airport transfers",
    ],
    exclusions: [
      "International airfare",
      "Visa fees",
      "Lunch and dinner (except mentioned)",
      "ATV tour and optional activities",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
      "Hammam charges",
    ],
    whyChoose: [
      "Hot air balloon ride over fairy chimneys",
      "Unique cave hotel experience",
      "Visit historic Istanbul landmarks",
      "Underground cities and unique landscapes",
      "Rich cultural experiences",
      "Comprehensive tour of Turkey's highlights",
    ],
    whatsappMessage: "Hi, I am interested in the Splendid Turkiye Package",
    metaDescription:
      "Discover Turkey with Istanbul and Cappadocia. Hot air balloon ride, historic sites, and unique landscapes. 7-day package starting from ₹79,999 per person.",
  },
  {
    slug: "seven-sisters-east-package",
    title: "Seven Sisters Of East Package",
    location: "Assam, Meghalaya, Arunachal Pradesh",
    country: "India",
    duration: "8 Days / 7 Nights",
    price: "₹59,999",
    rating: 4.7,
    reviewCount: 89,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    images: [
      "/ladakh-mountains-pangong-lake-adventure.jpg",
      "/kerala-backwaters-houseboat-beautiful-nature.jpg",
      "/manali-mountains-snow-adventure-himachal.jpg",
    ],
    highlights: ["Living Root Bridges", "Tea Gardens", "Waterfalls"],
    activities: ["Trekking", "Sightseeing", "Photography"],
    type: "domestic",
    overview:
      "Explore the unexplored beauty of Northeast India with this comprehensive Seven Sisters package. From the tea gardens of Assam to the living root bridges of Meghalaya, from pristine waterfalls to tribal cultures, discover the hidden gems of India's northeastern states.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Guwahati",
        description:
          "Arrive in Guwahati, the gateway to Northeast India. Transfer to your hotel. Visit Kamakhya Temple, one of the most sacred Shakti Peethas. Enjoy a sunset cruise on the Brahmaputra River.",
        activities: ["Airport Transfer", "Hotel Check-in", "Temple Visit", "River Cruise"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Guwahati to Shillong",
        description:
          "Drive to Shillong, the Scotland of the East. Visit Umiam Lake, a beautiful man-made reservoir. Explore Shillong Peak for panoramic views and Don Bosco Museum to learn about tribal cultures.",
        activities: ["Drive to Shillong", "Umiam Lake", "Shillong Peak", "Museum Visit"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 3,
        title: "Cherrapunji & Living Root Bridges",
        description:
          "Visit Cherrapunji, one of the wettest places on earth. See the famous living root bridges, natural bridges formed by tree roots. Visit Nohkalikai Falls, the tallest plunge waterfall in India.",
        activities: ["Cherrapunji", "Living Root Bridges", "Waterfall Visit", "Trekking"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Shillong to Kaziranga",
        description:
          "Drive to Kaziranga National Park, home to the one-horned rhinoceros. Check into your wildlife resort. Evening jeep safari to spot rhinos, elephants, and various bird species.",
        activities: ["Drive to Kaziranga", "Wildlife Resort", "Evening Safari"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 5,
        title: "Kaziranga Safari",
        description:
          "Early morning elephant safari for close encounters with rhinos. After breakfast, visit a tea garden and learn about tea processing. Afternoon jeep safari in different zones of the park.",
        activities: ["Elephant Safari", "Tea Garden", "Afternoon Safari"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 6,
        title: "Kaziranga to Tawang",
        description:
          "Drive to Tawang in Arunachal Pradesh, passing through Sela Pass. Visit Tawang Monastery, the largest monastery in India. Enjoy the scenic beauty of the Eastern Himalayas.",
        activities: ["Drive to Tawang", "Sela Pass", "Monastery Visit"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 7,
        title: "Tawang Exploration",
        description:
          "Visit Bum La Pass (border area with permits), Madhuri Lake, and Tawang War Memorial. Explore local markets and interact with the Monpa tribe. Enjoy traditional Monpa cuisine.",
        activities: ["Bum La Pass", "Madhuri Lake", "War Memorial", "Local Markets"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 8,
        title: "Departure",
        description:
          "After breakfast, drive back to Guwahati or Tezpur for your departure flight, carrying beautiful memories of the Seven Sisters.",
        activities: ["Return Drive", "Airport Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "7 nights accommodation in hotels and wildlife resorts",
      "Daily breakfast and dinner",
      "All transfers and transportation",
      "Kaziranga National Park safaris (elephant + jeep)",
      "All entrance fees and permits",
      "Inner Line Permits for Arunachal Pradesh",
      "Driver cum guide",
      "Airport transfers",
    ],
    exclusions: [
      "Airfare or train tickets",
      "Lunch",
      "Bum La Pass special permits",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
      "Optional activities",
      "Camera fees",
    ],
    whyChoose: [
      "Explore unexplored Northeast India",
      "See one-horned rhinos in Kaziranga",
      "Unique living root bridges",
      "Rich tribal cultures and traditions",
      "Stunning natural beauty",
      "Comprehensive tour of three states",
    ],
    whatsappMessage: "Hi, I am interested in the Seven Sisters Of East Package",
    metaDescription:
      "Discover Northeast India with Kaziranga, living root bridges, and tribal cultures. 8-day package starting from ₹59,999 per person.",
  },
  {
    slug: "rajasthan-heritage-package",
    title: "Rajasthan Heritage Package",
    location: "Jaipur, Udaipur, Jodhpur",
    country: "India",
    duration: "6 Days / 5 Nights",
    price: "₹15,999",
    rating: 4.8,
    reviewCount: 312,
    image: "/ladakh-mountains-pangong-lake-adventure.jpg",
    images: [
      "/ladakh-mountains-pangong-lake-adventure.jpg",
      "/coastal-hiking-beach-cliffs-adventure.jpg",
      "/kerala-backwaters-houseboat-beautiful-nature.jpg",
    ],
    highlights: ["Royal Palaces", "Desert Safari", "Cultural Shows"],
    activities: ["Sightseeing", "Cultural Tours", "Photography"],
    type: "domestic",
    overview:
      "Immerse yourself in the royal heritage of Rajasthan with this comprehensive package. From the Pink City Jaipur to the City of Lakes Udaipur, from the Blue City Jodhpur to the golden sand dunes, experience the grandeur of Rajputana culture, magnificent palaces, and vibrant traditions.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Jaipur",
        description:
          "Arrive in Jaipur, the Pink City. Transfer to your hotel. Visit the magnificent Amber Fort, a UNESCO World Heritage Site. Enjoy an elephant or jeep ride up to the fort. Evening free to explore local markets.",
        activities: ["Airport Transfer", "Hotel Check-in", "Amber Fort", "Elephant Ride"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Jaipur City Tour",
        description:
          "Full-day city tour visiting City Palace, Jantar Mantar (astronomical observatory), Hawa Mahal (Palace of Winds), and Albert Hall Museum. Enjoy traditional Rajasthani dinner with cultural show.",
        activities: ["City Palace", "Jantar Mantar", "Hawa Mahal", "Cultural Show"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 3,
        title: "Jaipur to Udaipur",
        description:
          "Drive to Udaipur, the City of Lakes. En route, visit the famous Ranakpur Jain Temple with its intricate marble carvings. Upon arrival, check into your hotel with lake view.",
        activities: ["Drive to Udaipur", "Ranakpur Temple", "Hotel Check-in"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Udaipur Sightseeing",
        description:
          "Visit the magnificent City Palace complex, Jagdish Temple, and Saheliyon Ki Bari. Enjoy a boat ride on Lake Pichola with views of the Lake Palace. Evening free for shopping.",
        activities: ["City Palace", "Boat Ride", "Temple Visit", "Shopping"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 5,
        title: "Udaipur to Jodhpur",
        description:
          "Drive to Jodhpur, the Blue City. Visit the majestic Mehrangarh Fort, one of India's largest forts. Explore the blue-painted houses of the old city and visit Jaswant Thada. Enjoy sunset views.",
        activities: ["Drive to Jodhpur", "Mehrangarh Fort", "Blue City", "Sunset Viewing"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 6,
        title: "Jodhpur Desert Safari & Departure",
        description:
          "Morning visit to Osian Temple. Afternoon desert safari experience with camel ride and traditional Rajasthani dinner in the desert. Transfer to airport for departure.",
        activities: ["Osian Temple", "Desert Safari", "Camel Ride", "Airport Transfer"],
        meals: ["Breakfast", "Dinner"],
      },
    ],
    inclusions: [
      "5 nights accommodation in heritage hotels",
      "Daily breakfast and dinner",
      "All transfers and transportation",
      "All entrance fees and sightseeing",
      "Boat ride in Udaipur",
      "Desert safari with camel ride",
      "Cultural show in Jaipur",
      "Driver cum guide",
      "Airport transfers",
    ],
    exclusions: [
      "Airfare or train tickets",
      "Lunch",
      "Elephant ride charges at Amber Fort",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
      "Optional activities",
    ],
    whyChoose: [
      "Visit three most beautiful cities of Rajasthan",
      "Stay in heritage hotels",
      "Experience royal grandeur and culture",
      "Desert safari included",
      "Rich history and architecture",
      "Best value heritage tour",
    ],
    whatsappMessage: "Hi, I am interested in the Rajasthan Heritage Package",
    metaDescription:
      "Explore Rajasthan's royal heritage with Jaipur, Udaipur, and Jodhpur. Palaces, forts, and desert safari. 6-day package starting from ₹15,999 per person.",
  },
  {
    slug: "singapore-langkawi-package",
    title: "Singapore with Langkawi Package",
    location: "Singapore, Langkawi",
    country: "Malaysia & Singapore",
    duration: "6 Days / 5 Nights",
    price: "₹39,999",
    rating: 4.8,
    reviewCount: 176,
    image: "/thailand-beach-islands-tropical-paradise.jpg",
    images: [
      "/thailand-beach-islands-tropical-paradise.jpg",
      "/thailand-islands-beaches-tropical.jpg",
      "/coastal-hiking-beach-cliffs-adventure.jpg",
    ],
    highlights: ["Marina Bay", "Sentosa Island", "Cable Car"],
    activities: ["Sightseeing", "Shopping", "Beach Activities"],
    type: "international",
    overview:
      "Experience the best of both worlds with this amazing package combining the modern marvels of Singapore with the tropical paradise of Langkawi. From futuristic architecture to pristine beaches, from world-class shopping to island adventures, this dual-destination package offers an unforgettable experience.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Singapore",
        description:
          "Arrive at Changi Airport and transfer to your hotel. After check-in, visit Marina Bay Sands and Gardens by the Bay. Enjoy the light and sound show in the evening. Explore the vibrant nightlife.",
        activities: ["Airport Transfer", "Hotel Check-in", "Marina Bay", "Gardens by the Bay"],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Singapore City Tour",
        description:
          "Full-day city tour visiting Merlion Park, Sentosa Island, Universal Studios (optional), and Singapore Flyer. Explore Orchard Road for shopping and enjoy local cuisine at hawker centers.",
        activities: ["City Tour", "Sentosa Island", "Shopping", "Universal Studios (Optional)"],
        meals: ["Breakfast"],
      },
      {
        day: 3,
        title: "Singapore to Langkawi",
        description:
          "Morning flight to Langkawi, Malaysia. Transfer to your beachfront resort. After check-in, relax at the beach or visit Langkawi Sky Bridge via cable car for panoramic views of the islands.",
        activities: ["Flight to Langkawi", "Resort Check-in", "Cable Car", "Sky Bridge"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Langkawi Island Hopping",
        description:
          "Full-day island hopping tour visiting Pulau Dayang Bunting (Lake of the Pregnant Maiden), Pulau Singa Besar for eagle feeding, and Pulau Beras Basah for beach activities. Enjoy snorkeling and swimming.",
        activities: ["Island Hopping", "Eagle Feeding", "Snorkeling", "Beach Activities"],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 5,
        title: "Langkawi Leisure",
        description:
          "Visit Langkawi Underwater World, Mahsuri's Tomb, and enjoy duty-free shopping. Optional activities include jet skiing, parasailing, or simply relaxing at the beach. Enjoy sunset cruise (optional).",
        activities: ["Underwater World", "Shopping", "Beach Activities", "Sunset Cruise (Optional)"],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 6,
        title: "Departure",
        description:
          "After breakfast, check out from the resort. Depending on your flight, enjoy some last-minute shopping. Transfer to Langkawi Airport for your departure.",
        activities: ["Hotel Check-out", "Shopping (Optional)", "Airport Transfer"],
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "3 nights in Singapore (3-star hotel)",
      "2 nights in Langkawi (beachfront resort)",
      "Daily breakfast",
      "All transfers and transportation",
      "Flight from Singapore to Langkawi",
      "Langkawi cable car and sky bridge",
      "Island hopping tour with lunch",
      "City tour in Singapore",
      "English-speaking guide",
      "Airport transfers",
    ],
    exclusions: [
      "International airfare",
      "Visa fees",
      "Universal Studios tickets",
      "Water sports activities",
      "Sunset cruise",
      "Lunch and dinner (except mentioned)",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
    ],
    whyChoose: [
      "Two amazing destinations in one trip",
      "Modern city and tropical island",
      "World-class attractions and beaches",
      "Duty-free shopping in Langkawi",
      "Perfect for families and couples",
      "Great value dual-destination package",
    ],
    whatsappMessage: "Hi, I am interested in the Singapore with Langkawi Package",
    metaDescription:
      "Experience Singapore and Langkawi with city tours, beaches, and island hopping. 6-day package starting from ₹39,999 per person.",
  },
]

export function getAllPackages() {
  return packages
}

export function getPackageBySlug(slug: string): PackageDetails | undefined {
  return packages.find((pkg) => pkg.slug === slug)
}

export function getSimilarPackages(currentSlug: string, limit: number = 4): PackageDetails[] {
  const current = getPackageBySlug(currentSlug)
  if (!current) return []

  return packages
    .filter((pkg) => pkg.slug !== currentSlug && pkg.type === current.type)
    .slice(0, limit)
}
