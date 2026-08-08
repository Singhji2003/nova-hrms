import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  modulesCount: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  companyName: { type: String, default: 'Acme Corporation' }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
