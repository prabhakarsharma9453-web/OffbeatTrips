import mongoose, { Schema, Model } from 'mongoose'

export interface IPackage {
  _id?: string
  slug: string
  title: string
  location: string
  country: string
  duration: string
  price: string
  rating: number
  reviewCount: number
  image: string
  images?: string[]
  highlights?: string[]
  activities?: string[]
  type: 'domestic' | 'international'
  overview: string
  itinerary?: Array<{
    day: number
    title: string
    description: string
    activities?: string[]
    meals?: string[]
  }>
  inclusions?: string[]
  exclusions?: string[]
  whyChoose?: string[]
  whatsappMessage?: string
  metaDescription?: string
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

const PackageSchema = new Schema<IPackage>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
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
    images: [String],
    highlights: [String],
    activities: [String],
    type: {
      type: String,
      enum: ['domestic', 'international'],
      default: 'domestic',
    },
    overview: {
      type: String,
      required: true,
    },
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        activities: [String],
        meals: [String],
      },
    ],
    inclusions: [String],
    exclusions: [String],
    whyChoose: [String],
    whatsappMessage: String,
    metaDescription: String,
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

PackageSchema.index({ slug: 1 })
PackageSchema.index({ type: 1 })
PackageSchema.index({ order: 1 })

const Package: Model<IPackage> = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema)

export default Package
