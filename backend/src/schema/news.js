import mongoose, { Schema } from 'mongoose';

const newsSchema = new Schema({
  title: { type: String, required: true }, slug: { type: String, unique: true, required: true }, content: { type: String, required: true }, excerpt: { type: String }, imageUrl: { type: String }, authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }, views: { type: Number, default: 0 }, publishedDate: { type: Date }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const NewsModel = mongoose.model('News', newsSchema);
