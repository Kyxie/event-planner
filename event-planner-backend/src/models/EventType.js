import mongoose from 'mongoose'

const EventTypeSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
})

export default mongoose.model('EventType', EventTypeSchema)
