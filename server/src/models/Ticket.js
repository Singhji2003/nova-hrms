import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  assignedAsset: { type: String, default: 'MacBook Pro 16" M3 Max' },
  employeeName: { type: String, default: 'David Chen' }
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);
