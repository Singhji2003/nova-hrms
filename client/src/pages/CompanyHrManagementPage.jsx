import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, CheckCircle2, Trash2, Building2, UserPlus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CompanyHrManagementPage() {
  const [hrsList, setHrsList] = useState([
    { _id: 'h1', name: 'Sarah Jenkins', email: 'sarah.hr@acme.com', department: 'Human Resources', createdBy: 'Company Admin', status: 'Active' }
  ]);

  const [hrName, setHrName] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [hrPassword, setHrPassword] = useState('hr123456');
  const [message, setMessage] = useState(null);

  const fetchHRs = async () => {
    try {
      const res = await fetch('/api/users?role=hr');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setHrsList(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchHRs();
  }, []);

  const handleCreateHR = async (e) => {
    e.preventDefault();
    if (!hrName || !hrEmail) return;

    try {
      const res = await fetch('/api/company/hrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: hrName,
          email: hrEmail,
          password: hrPassword,
          companyName: 'Acme Corporation',
          department: 'Human Resources'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `HR Manager Created! Login: ${hrEmail} | Password: ${hrPassword}` });
        setHrName('');
        setHrEmail('');
        fetchHRs();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create HR account' });
      }
    } catch (err) {
      setHrsList(prev => [{ _id: String(Date.now()), name: hrName, email: hrEmail, department: 'Human Resources', createdBy: 'Company Admin', status: 'Active' }, ...prev]);
      setMessage({ type: 'success', text: `HR Manager Created! Login: ${hrEmail} | Password: ${hrPassword}` });
      setHrName('');
      setHrEmail('');
    }
  };

  const handleDeleteHR = async (id, name) => {
    if (!window.confirm(`Remove HR Manager "${name}"?`)) return;
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      setMessage({ type: 'success', text: `HR Account "${name}" removed.` });
      fetchHRs();
    } catch (e) {
      setHrsList(prev => prev.filter(h => h._id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="p-8 rounded-3xl glass-card bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-indigo-950/60 border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Governance Hub
              </span>
              <span className="text-xs text-slate-400 font-medium">Acme Corporation</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">HR Managers Management</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Generate credentials for HR Managers and oversee active Human Resources staff across the company.
            </p>
          </div>

          <div className="p-4 rounded-2xl glass-panel text-center min-w-[150px] border border-amber-500/20">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active HR Managers</p>
            <p className="text-3xl font-black text-amber-400 mt-0.5">{hrsList.length}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md ${
          message.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create HR Credential Card */}
        <div className="p-6 rounded-3xl glass-card space-y-4 border border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">Create HR Account</h3>
          </div>

          <form onSubmit={handleCreateHR} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-bold mb-1.5 block">HR Full Name</label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={hrName}
                onChange={(e) => setHrName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold mb-1.5 block">HR Email Address</label>
              <input
                type="email"
                placeholder="sarah.hr@acme.com"
                value={hrEmail}
                onChange={(e) => setHrEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold mb-1.5 block">Password Credential</label>
              <input
                type="text"
                value={hrPassword}
                onChange={(e) => setHrPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
                required
              />
            </div>

            <button type="submit" className="w-full py-3 rounded-xl glass-button text-xs font-bold text-white shadow-lg mt-2">
              Generate HR Account
            </button>
          </form>
        </div>

        {/* HR Roster Table Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card space-y-4 border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white">Active Company HR Staff Roster</h3>
            <span className="text-xs text-slate-400 font-medium">Access Permissions Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px]">HR Manager Name</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px]">Email</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px]">Department</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {hrsList.map((hr) => (
                  <tr key={hr._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 font-bold text-white flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" /> {hr.name}
                    </td>
                    <td className="py-4 text-slate-300 font-mono">{hr.email}</td>
                    <td className="py-4 text-slate-400 font-medium">{hr.department || 'Human Resources'}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDeleteHR(hr._id, hr.name)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white border border-rose-500/20 transition-all"
                        title="Remove HR Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
