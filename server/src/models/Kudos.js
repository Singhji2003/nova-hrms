import mongoose from 'mongoose';

const kudosSchema = new mongoose.Schema({
  fromUser: { type: String, required: true },
  fromAvatar: { type: String },
  toUser: { type: String, required: true },
  toAvatar: { type: String },
  badge: { type: String, enum: ['🌟 Innovation Champion', '🚀 Team Player', '🎯 Goal Crusher', '💡 Problem Solver'], default: '🌟 Innovation Champion' },
  message: { type: String, required: true },
  likesCount: { type: Number, default: 4 }
}, { timestamps: true });

export default mongoose.model('Kudos', kudosSchema);
