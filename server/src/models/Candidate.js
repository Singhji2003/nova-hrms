import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  stage: { type: String, enum: ['Applied', 'Screening', 'Interview', 'Offered'], default: 'Applied' },
  aiMatchScore: { type: Number, required: true }, // e.g. 94%
  experienceYears: { type: Number, default: 5 },
  skills: [{ type: String }],
  resumeSummary: { type: String },
  appliedDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export default mongoose.model('Candidate', candidateSchema);
