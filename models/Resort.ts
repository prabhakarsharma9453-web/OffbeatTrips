import mongoose, { Schema, Model } from 'mongoose'

export interface IResort {
  _id?: string
  name: string
  resortsName: string
  image: string
  images?: string[] // Array of image URLs for gallery
  roomTypes?: Array<{
    name: string
    price?: string
    image?: string
    images?: string[]
    description?: string
    amenities?: string[]
  }>
  shortDescription: string
  addressTile: string
  roomAmenities1?: string
  roomAmenities2?: string
  roomAmenities3?: string
  roomAmenities4?: string
  resortAmenities1?: string
  resortAmenities2?: string
  resortAmenities3?: string
  resortAmenities4?: string
  tags?: string
  mood?: string
  activities?: string
  price?: string
  type?: 'domestic' | 'international'
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

const ResortSchema = new Schema<IResort>(
  {
    name: {
      type: String,
      required: true,
    },
    resortsName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    roomTypes: {
      type: [
        new Schema(
          {
            name: { type: String, required: true },
            price: { type: String, default: '' },
            image: { type: String, default: '' },
            images: { type: [String], default: [] },
            description: { type: String, default: '' },
            amenities: { type: [String], default: [] },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    addressTile: {
      type: String,
      default: '',
    },
    roomAmenities1: String,
    roomAmenities2: String,
    roomAmenities3: String,
    roomAmenities4: String,
    resortAmenities1: String,
    resortAmenities2: String,
    resortAmenities3: String,
    resortAmenities4: String,
    tags: String,
    mood: String,
    activities: String,
    price: String,
    type: {
      type: String,
      enum: ['domestic', 'international'],
      default: 'domestic',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

ResortSchema.index({ order: 1 })
ResortSchema.index({ tags: 1 })

const Resort: Model<IResort> = mongoose.models.Resort || mongoose.model<IResort>('Resort', ResortSchema)

export default Resort
