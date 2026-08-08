import React, { useState, useEffect } from 'react';
import { HelpCircle, Laptop, Plus, CheckCircle2, Clock, AlertCircle, Check, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HelpdeskPage() {
  const { currentRole, user } = useAuth();
  const [tickets, setTickets] = useState([
    { _id: 't1', ticketId: 'TCK-201', title: 'MacBook Pro M3 Max display flicker', category: 'IT Support', priority: 'High', status: 'In Progress', employeeName: 'David Chen' },
    { _id: 't2', ticketId: 'TCK-198', title: 'PF Deduction query for July payslip', category: 'Finance', priority: 'Medium', status: 'Resolved', employeeName: 'David Chen' }
  ]);

  const [assets, setAssets] = useState([
    { id: 'a1', name: 'MacBook Pro 16" M3 Max', tag: 'ACME-HW-8841', serial: 'C02G9981', assignedTo: 'David Chen', status: 'Active Assignment' },
    { id: 'a2', name: 'Dell UltraSharp 27" 4K Monitor', tag: 'ACME-HW-4412', serial: 'CN09212', assignedTo: 'David Chen', status: 'Active Assignment' }
  ]);

  // Modal States
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [showAssignAssetModal, setShowAssignAssetModal] = useState(false);

  // New Ticket Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IT Support');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');

  // New Asset Form State
  const [assetName, setAssetName] = useState('');
  const [assetTag, setAssetTag] = useState('');
  const [assignedTo, setAssignedTo] = useState('David Chen');

  const [message, setMessage] = useState(null);

  const isHR = currentRole === 'hr' || currentRole === 'company' || currentRole === 'superadmin';

  // Fetch Tickets
  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setTickets(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 1. Raise Ticket
  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          employeeName: user.name || 'David Chen'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Support Ticket "${data.ticketId}" created!` });
        setShowRaiseModal(false);
        setTitle('');
        setDescription('');
        fetchTickets();
      }
    } catch (err) {
      setTickets(prev => [{ _id: String(Date.now()), ticketId: 'TCK-' + Math.floor(200+Math.random()*800), title, category, priority, status: 'Open', employeeName: user.name || 'David Chen' }, ...prev]);
      setMessage({ type: 'success', text: `Support Ticket created!` });
      setShowRaiseModal(false);
      setTitle('');
    }
  };

  // 2. Change Ticket Status (HR Manager Control)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/tickets/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `Ticket status updated to "${newStatus}"!` });
        fetchTickets();
      } else {
        setTickets(prev => prev.map(t => (t._id === id || t.id === id) ? { ...t, status: newStatus } : t));
        setMessage({ type: 'success', text: `Ticket status updated to "${newStatus}"!` });
      }
    } catch (err) {
      setTickets(prev => prev.map(t => (t._id === id || t.id === id) ? { ...t, status: newStatus } : t));
      setMessage({ type: 'success', text: `Ticket status updated to "${newStatus}"!` });
    }
  };

  // 3. Assign New Asset (HR Control)
  const handleAssignAsset = (e) => {
    e.preventDefault();
    if (!assetName) return;
    const newAsset = {
      id: String(Date.now()),
      name: assetName,
      tag: assetTag || 'ACME-HW-' + Math.floor(1000+Math.random()*9000),
      serial: 'SN' + Math.floor(10000+Math.random()*90000),
      assignedTo: assignedTo,
      status: 'Active Assignment'
    };
    setAssets(prev => [newAsset, ...prev]);
    setMessage({ type: 'success', text: `Hardware Asset "${assetName}" assigned to ${assignedTo}!` });
    setShowAssignAssetModal(false);
    setAssetName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-amber-950/70 via-slate-900/80 to-indigo-950/70 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Support & Asset Hub
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">IT Helpdesk & Asset Management</h2>
          <p className="text-xs text-slate-300">Raise support tickets, update ticket statuses, and assign company equipment.</p>
        </div>

        <div className="flex items-center gap-2">
          {isHR && (
            <button
              onClick={() => setShowAssignAssetModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-xs font-bold text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all"
            >
              <Laptop className="w-4 h-4" /> Assign Hardware
            </button>
          )}
          <button
            onClick={() => setShowRaiseModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-xs font-bold text-white shadow-pink-glow"
          >
            <Plus className="w-4 h-4" /> Raise Support Ticket
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Tickets Queue */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Active Support Tickets
            </h3>
            <span className="text-xs text-slate-400">{tickets.length} Open Tickets</span>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => {
              const ticketId = t._id || t.id;
              return (
                <div key={ticketId} className="p-4 rounded-xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-white/5 hover:border-amber-500/30 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-300">{t.ticketId || 'TCK-201'}</span>
                      <span className="font-bold text-white text-sm">{t.title || t.subject}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Requested by: <span className="text-slate-200 font-semibold">{t.employeeName || 'David Chen'}</span> • Priority: <span className="text-amber-400 font-bold">{t.priority}</span> • Category: {t.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      t.status === 'In Progress' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {t.status}
                    </span>

                    {/* HR Management Actions */}
                    {isHR && (
                      <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                        {t.status !== 'In Progress' && (
                          <button
                            onClick={() => handleUpdateStatus(ticketId, 'In Progress')}
                            className="px-2 py-1 rounded text-[10px] font-bold bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/40"
                            title="Mark In Progress"
                          >
                            In Progress
                          </button>
                        )}
                        {t.status !== 'Resolved' && (
                          <button
                            onClick={() => handleUpdateStatus(ticketId, 'Resolved')}
                            className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/40 inline-flex items-center gap-1"
                            title="Mark Resolved"
                          >
                            <Check className="w-3 h-3" /> Resolve
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Hardware Assets */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Laptop className="w-4 h-4 text-indigo-400" /> Assigned IT Hardware Assets
          </h3>

          <div className="space-y-3 text-xs">
            {assets.map((asset) => (
              <div key={asset.id} className="p-3.5 rounded-xl glass-panel space-y-1 border border-white/5">
                <p className="font-bold text-white text-sm">{asset.name}</p>
                <p className="text-[10px] text-slate-400">Tag: {asset.tag} • Serial: {asset.serial}</p>
                <p className="text-[10px] text-indigo-300 font-semibold pt-1">Assigned to: {asset.assignedTo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal 1: Raise Support Ticket */}
      {showRaiseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-amber-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Raise New Support Ticket</h3>
              <button onClick={() => setShowRaiseModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleRaiseTicket} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Subject / Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. MacBook Pro battery drain issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="IT Support" className="bg-slate-900">IT Hardware & Software Support</option>
                  <option value="Finance" className="bg-slate-900">Payroll & Payslip Query</option>
                  <option value="Security" className="bg-slate-900">VPN & Credentials Access</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Priority Level</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="Low" className="bg-slate-900">Low</option>
                  <option value="Medium" className="bg-slate-900">Medium</option>
                  <option value="High" className="bg-slate-900">High / Urgent</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Issue Description</label>
                <textarea
                  placeholder="Describe your issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                ></textarea>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white mt-2">
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Assign Hardware Asset (HR) */}
      {showAssignAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-indigo-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Assign IT Hardware Asset</h3>
              <button onClick={() => setShowAssignAssetModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleAssignAsset} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Device / Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. iPad Pro 12.9 M2"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Asset Tag ID</label>
                <input
                  type="text"
                  placeholder="e.g. ACME-HW-9914"
                  value={assetTag}
                  onChange={(e) => setAssetTag(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Assign to Employee</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white mt-2">
                Assign Equipment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
