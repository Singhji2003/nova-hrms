import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  docName: { type: String, required: true },
  docType: { type: String, enum: ['Offer Letter', 'Tax Form', 'ID Proof', 'NDA Contract'], default: 'NDA Contract' },
  uploadDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['Verified', 'Pending Review'], default: 'Verified' }
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);
