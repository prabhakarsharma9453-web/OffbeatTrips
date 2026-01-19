import mongoose, { Schema, Model } from 'mongoose'

export interface IDestination {
  _id?: string
  name: string // e.g. Norway
  country: string // label shown above name (e.g. Europe / India / Asia)
  trips: number // shown as "X Trips Available"
  image: string
  slug: string // used in /trips/[slug]
  isPopular: boolean
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

const DestinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    trips: { type: Number, default: 0 },
    image: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    isPopular: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
)

DestinationSchema.index({ isPopular: 1, order: 1 })

const Destination: Model<IDestination> =
  mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema)

export default Destination

