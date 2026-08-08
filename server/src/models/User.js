import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'company', 'hr', 'employee'], 
    default: 'employee' 
  },
  companyName: { type: String, default: 'Acme Corporation' },
  department: { type: String, default: 'General' },
  jobTitle: { type: String, default: 'Team Member' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  employeeId: { type: String },
  createdBy: { type: String, default: 'System' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
