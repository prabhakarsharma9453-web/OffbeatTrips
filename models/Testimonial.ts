import mongoose, { Schema, Model } from 'mongoose'

export interface ITestimonial {
  _id?: string
  name: string
  location?: string
  rating: number
  image?: string
  text: string
  packageName?: string
  createdAt?: Date
  updatedAt?: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    location: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    image: { type: String, default: '' },
    text: { type: String, required: true },
    packageName: { type: String, default: '' },
  },
  { timestamps: true }
)

TestimonialSchema.index({ createdAt: -1 })

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)

export default Testimonial

