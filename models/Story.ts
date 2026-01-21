import mongoose, { Schema, Model } from 'mongoose'

export interface IStory {
  _id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  images?: string[]
  category?: string
  readTimeMinutes?: number
  authorId: string
  authorName: string
  authorImage?: string
  createdAt?: Date
  updatedAt?: Date
}

const StorySchema = new Schema<IStory>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    category: { type: String, default: 'Travel' },
    readTimeMinutes: { type: Number, default: 5 },
    authorId: { type: String, required: true, index: true },
    authorName: { type: String, required: true },
    authorImage: { type: String, default: '' },
  },
  { timestamps: true }
)

StorySchema.index({ createdAt: -1 })
StorySchema.index({ title: 'text', excerpt: 'text', content: 'text', category: 'text', authorName: 'text' })

const Story: Model<IStory> = mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema)

export default Story

