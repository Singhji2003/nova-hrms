import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Travel' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  receiptUrl: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Reimbursed'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
