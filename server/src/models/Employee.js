import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  employeeId: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'On Leave', 'Terminated'], default: 'Active' },
  salary: {
    basic: { type: Number, default: 50000 },
    hra: { type: Number, default: 20000 },
    allowances: { type: Number, default: 15000 },
    pfDeduction: { type: Number, default: 6000 },
    taxDeduction: { type: Number, default: 4000 }
  },
  manager: { type: String, default: 'Sarah Jenkins' },
  avatar: { type: String }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
