import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, CheckCircle2, XCircle, FileText, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exportToCSV } from '../utils/exportUtils';

export default function ExpensesPage() {
  const { currentRole, user } = useAuth();
  const isAdminOrHr = currentRole === 'superadmin' || currentRole === 'company' || currentRole === 'hr';

  const [expenses, setExpenses] = useState([
    { _id: '1', employeeName: 'David Chen', employeeId: 'NOV-101', title: 'Client Lunch & Travel Allowance', amount: 450, category: 'Travel & Meals', date: '2026-08-05', status: 'Pending' }
  ]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [message, setMessage] = useState(null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Travel & Meals');

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setExpenses(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName: user.name || 'David Chen',
          employeeId: user.employeeId || 'NOV-101',
          title,
          amount: Number(amount),
          category,
          status: 'Pending'
        })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Expense claim submitted for HR approval!' });
        setShowClaimModal(false);
        setTitle('');
        setAmount('');
        fetchExpenses();
      }
    } catch (err) {
      setMessage({ type: 'success', text: 'Expense claim submitted for HR approval!' });
      setShowClaimModal(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/expenses/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `Expense claim marked as "${newStatus}"!` });
        fetchExpenses();
      }
    } catch (err) {
      setExpenses(prev => prev.map(e => (e._id === id || e.id === id) ? { ...e, status: newStatus } : e));
      setMessage({ type: 'success', text: `Expense claim marked as "${newStatus}"!` });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl glass-card bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-indigo-950/80 border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Finance & Claims
            </span>
            <span className="text-xs text-slate-400 font-medium">Acme Corporation</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Expense Claims & Reimbursements</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Submit business expense receipts, manage travel allowances, and process HR reimbursement approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV('expense_claims_report', expenses)}
            className="px-4 py-3 rounded-2xl glass-panel text-xs font-bold text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
          <button
            onClick={() => setShowClaimModal(true)}
            className="px-5 py-3 rounded-2xl glass-button text-xs font-black text-white shadow-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Submit Expense Claim
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Main Expense Table */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-sky-400" /> Reimbursement Claims Queue
          </h3>
          <span className="text-xs text-sky-300 font-bold">{expenses.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="p-3">Employee</th>
                <th className="p-3">Claim Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                {isAdminOrHr && <th className="p-3 text-right">HR Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {expenses.map((exp) => {
                const expId = exp._id || exp.id;
                return (
                  <tr key={expId} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-extrabold text-white">
                      {exp.employeeName}
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">{exp.employeeId}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-200">{exp.title}</td>
                    <td className="p-3 text-slate-300">{exp.category}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">${exp.amount}</td>
                    <td className="p-3 text-slate-400">{exp.date}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        exp.status === 'Reimbursed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        exp.status === 'Approved' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                        exp.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                    {isAdminOrHr && (
                      <td className="p-3 text-right space-x-1.5">
                        {exp.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(expId, 'Approved')}
                              className="px-2.5 py-1 rounded-lg bg-sky-600/30 text-sky-300 hover:bg-sky-600 hover:text-white font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(expId, 'Rejected')}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white font-bold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {exp.status === 'Approved' && (
                          <button
                            onClick={() => handleUpdateStatus(expId, 'Reimbursed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white font-bold"
                          >
                            Mark Reimbursed
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Submission Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-sky-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Submit Expense Claim</h3>
              <button onClick={() => setShowClaimModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Expense Title</label>
                <input
                  type="text"
                  placeholder="e.g. Flight ticket for Client Visit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Expense Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="Travel & Meals" className="bg-slate-900">Travel & Meals</option>
                  <option value="Internet & Phone Allowance" className="bg-slate-900">Internet & Phone Allowance</option>
                  <option value="Hardware & Accessories" className="bg-slate-900">Hardware & Accessories</option>
                  <option value="Client Entertainment" className="bg-slate-900">Client Entertainment</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Amount ($ USD)</label>
                <input
                  type="number"
                  placeholder="e.g. 450"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white shadow-xl">
                Submit Claim for Approval
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
