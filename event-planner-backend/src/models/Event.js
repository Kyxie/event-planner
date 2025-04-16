import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    priority: { type: Number, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Event', eventSchema)
