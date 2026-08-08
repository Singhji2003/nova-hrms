import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  clockIn: { type: String, required: true },
  clockOut: { type: String },
  status: { type: String, enum: ['Present', 'Late', 'Half Day', 'On Leave'], default: 'Present' },
  location: { type: String, default: 'Headquarters - Geo Verified' },
  ipAddress: { type: String, default: '192.168.1.45' },
  overtimeHours: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
