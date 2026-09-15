import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrls: [{ type: String }],
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }],
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const ActivityModel = mongoose.model("Activity", activitySchema);
