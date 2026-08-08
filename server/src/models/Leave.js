import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  leaveType: { type: String, enum: ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity/Paternity'], required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  daysCount: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedOn: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export default mongoose.model('Leave', leaveSchema);
