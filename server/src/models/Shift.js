import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  shiftType: { type: String, enum: ['Morning (09:00 - 17:00)', 'Evening (16:00 - 00:00)', 'Night (00:00 - 08:00)', 'Remote Work'], default: 'Morning (09:00 - 17:00)' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  location: { type: String, default: 'Headquarters' },
  status: { type: String, default: 'Scheduled' }
}, { timestamps: true });

export default mongoose.model('Shift', shiftSchema);
