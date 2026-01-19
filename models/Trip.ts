import mongoose, { Schema, Model } from 'mongoose'

export type ActivitySlug =
  | 'hiking'
  | 'camping'
  | 'water-sports'
  | 'paragliding'
  | 'skiing'
  | 'cycling'
  | 'cruises'
  | 'photography-tours'

export interface ITrip {
  _id?: string
  slug: string
  title: string
  activity: ActivitySlug
  location: string
  country?: string
  duration: string
  price: string
  rating?: number
  reviewCount?: number
  image: string
  images?: string[]
  description?: string
  highlights?: string[]
  difficulty?: string
  groupSize?: string
  type?: 'domestic' | 'international'
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

const TripSchema = new Schema<ITrip>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      enum: [
        'hiking',
        'camping',
        'water-sports',
        'paragliding',
        'skiing',
        'cycling',
        'cruises',
        'photography-tours',
      ],
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    highlights: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      default: '',
    },
    groupSize: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['domestic', 'international'],
      default: 'domestic',
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
)

TripSchema.index({ activity: 1, order: 1 })
TripSchema.index({ title: 'text', location: 'text', country: 'text', description: 'text' })

const Trip: Model<ITrip> = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema)

export default Trip

