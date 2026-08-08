import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true },
  plan: { type: String, enum: ['Starter', 'Growth', 'Enterprise'], default: 'Growth' },
  employeeCount: { type: Number, default: 1 },
  monthlyBilling: { type: Number, default: 599 },
  status: { type: String, enum: ['Active', 'Suspended / Payment Overdue', 'Trial'], default: 'Active' },
  featuresEnabled: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
