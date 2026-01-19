import mongoose, { Schema, Model } from 'mongoose'

export interface IDestinationTrip {
  _id?: string
  slug: string
  destinationSlug: string // matches Destination.slug and /trips/[slug]
  destinationName: string // display only
  title: string
  location: string
  duration: string
  price: string
  rating?: number
  image: string
  images?: string[]
  description?: string
  highlights?: string[]
  inclusions?: string[]
  exclusions?: string[]
  mood?: string
  activities?: string[]
  type?: 'domestic' | 'international'
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

const DestinationTripSchema = new Schema<IDestinationTrip>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    destinationSlug: { type: String, required: true, index: true },
    destinationName: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, default: 4.8 },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    mood: { type: String, default: '' },
    activities: { type: [String], default: [] },
    type: { type: String, enum: ['domestic', 'international'], default: 'international', index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
)

DestinationTripSchema.index({ destinationSlug: 1, order: 1 })

const DestinationTrip: Model<IDestinationTrip> =
  mongoose.models.DestinationTrip || mongoose.model<IDestinationTrip>('DestinationTrip', DestinationTripSchema)

export default DestinationTrip

