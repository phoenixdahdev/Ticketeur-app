import { z } from 'zod'
import mongoose, { Schema, Document, Model } from 'mongoose'

export const waitListSchema = z.object({
  email: z
    .email('Please provide a valid email address')
    .transform((val) => val.toLowerCase().trim()),
})

export type WaitListInput = z.infer<typeof waitListSchema>

export interface IWaitList extends Document {
  email: string
  created_at: Date
  updated_at: Date
}

// Mongoose schema
const WaitListSchema: Schema<IWaitList> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const WaitList: Model<IWaitList> =
  mongoose.models.WaitList ||
  mongoose.model<IWaitList>('WaitList', WaitListSchema)

export default WaitList
