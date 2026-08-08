import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['Normal', 'Important', 'Urgent'], default: 'Important' },
  author: { type: String, default: 'Company HR' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
