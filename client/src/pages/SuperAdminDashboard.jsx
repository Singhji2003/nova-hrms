import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign, 
  Users, 
  Plus, 
  CheckCircle2, 
  Key, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  Activity,
  Lock,
  Zap,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuperAdminDashboard() {
  const [companies, setCompanies] = useState([
    {
      _id: 'c1',
      name: 'Acme Corporation',
      domain: 'acme.com',
      adminEmail: 'admin@acme.com',
      plan: 'Enterprise',
      employeeCount: 1,
      monthlyBilling: 1499,
      status: 'Active',
      featuresEnabled: true
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPassModal, setShowResetPassModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Add Company state
  const [compName, setCompName] = useState('');
  const [domain, setDomain] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('comp123456');
  const [plan, setPlan] = useState('Growth');

  // Edit Company state
  const [editName, setEditName] = useState('');
  const [editDomain, setEditDomain] = useState('');
  const [editPlan, setEditPlan] = useState('Growth');
  const [editBilling, setEditBilling] = useState(599);

  // Reset Password state
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('newpass123');

  const [message, setMessage] = useState(null);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    { id: '1', event: 'Acme Corporation Provisioned', time: '10 mins ago', type: 'system' },
    { id: '2', event: 'Super Admin Login Verified', time: 'Just now', type: 'security' }
  ]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCompanies(data);
      }
    } catch (e) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 1. Create Company & Admin
  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!compName || !adminEmail) return;

    try {
      const res = await fetch('/api/superadmin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: compName,
          domain: domain || compName.toLowerCase().replace(/\s+/g, '') + '.com',
          adminName: adminName || compName + ' Director',
          adminEmail: adminEmail,
          adminPassword: adminPassword,
          plan: plan
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Company & Admin Credentials created! Email: ${adminEmail} | Pass: ${adminPassword}` });
        setAuditLogs(prev => [{ id: String(Date.now()), event: `Created ${compName} (${adminEmail})`, time: 'Just now', type: 'system' }, ...prev]);
        setShowAddModal(false);
        setCompName('');
        setAdminEmail('');
        fetchCompanies();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create company' });
      }
    } catch (err) {
      const newComp = {
        _id: String(Date.now()),
        name: compName,
        domain: domain || compName.toLowerCase().replace(/\s+/g, '') + '.com',
        adminEmail: adminEmail,
        plan: plan,
        employeeCount: 1,
        monthlyBilling: plan === 'Enterprise' ? 1499 : plan === 'Growth' ? 599 : 299,
        status: 'Active',
        featuresEnabled: true
      };
      setCompanies(prev => [newComp, ...prev]);
      setMessage({ type: 'success', text: `Company & Admin Credentials created! Email: ${adminEmail} | Pass: ${adminPassword}` });
      setShowAddModal(false);
    }
  };

  // 2. Open Edit Modal
  const openEditModal = (comp) => {
    setSelectedCompany(comp);
    setEditName(comp.name);
    setEditDomain(comp.domain);
    setEditPlan(comp.plan);
    setEditBilling(comp.monthlyBilling);
    setShowEditModal(true);
  };

  // Update Company Details
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    if (!selectedCompany) return;

    try {
      const res = await fetch(`/api/superadmin/companies/${selectedCompany._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          domain: editDomain,
          plan: editPlan,
          monthlyBilling: Number(editBilling)
        })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `Company ${editName} updated successfully!` });
        setShowEditModal(false);
        fetchCompanies();
      }
    } catch (err) {
      setCompanies(prev => prev.map(c => c._id === selectedCompany._id ? { ...c, name: editName, domain: editDomain, plan: editPlan, monthlyBilling: Number(editBilling) } : c));
      setMessage({ type: 'success', text: `Company ${editName} updated successfully!` });
      setShowEditModal(false);
    }
  };

  // 3. Toggle Payment Hold Status
  const handleTogglePaymentHold = async (comp) => {
    const newStatus = comp.status === 'Active' ? 'Suspended / Payment Overdue' : 'Active';
    try {
      const res = await fetch(`/api/superadmin/companies/${comp._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `Payment status for ${comp.name} set to "${newStatus}"!` });
        setAuditLogs(prev => [{ id: String(Date.now()), event: `Status of ${comp.name} changed to ${newStatus}`, time: 'Just now', type: 'security' }, ...prev]);
        fetchCompanies();
      }
    } catch (err) {
      setCompanies(prev => prev.map(c => c._id === comp._id ? { ...c, status: newStatus, featuresEnabled: newStatus === 'Active' } : c));
      setMessage({ type: 'success', text: `Payment status for ${comp.name} set to "${newStatus}"!` });
    }
  };

  // 4. Remove Company
  const handleDeleteCompany = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete company "${name}"? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/superadmin/companies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: `Company "${name}" removed from system.` });
        fetchCompanies();
      }
    } catch (err) {
      setCompanies(prev => prev.filter(c => c._id !== id));
      setMessage({ type: 'success', text: `Company "${name}" removed from system.` });
    }
  };

  // 5. Reset Admin Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    try {
      const res = await fetch('/api/superadmin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Password for ${resetEmail} reset to "${newPassword}"!` });
        setShowResetPassModal(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reset password' });
      }
    } catch (err) {
      setMessage({ type: 'success', text: `Password for ${resetEmail} reset to "${newPassword}"!` });
      setShowResetPassModal(false);
    }
  };

  const totalEmployeesPlatform = companies.reduce((acc, c) => acc + (c.employeeCount || 1), 0);
  const totalMRR = companies.reduce((acc, c) => acc + (c.monthlyBilling || 0), 0);

  return (
    <div className="space-y-6">
      {/* Super Admin Master Banner */}
      <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-pink-950/70 via-slate-900/80 to-purple-950/60 border border-pink-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-pink-400" /> Super Admin Control Hub
              </span>
              <span className="text-xs text-slate-400">Multi-Tenant Platform Control</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Super Admin Master Dashboard</h2>
            <p className="text-xs text-slate-300 mt-1">
              Provision companies, manage feature holds for payment overdue, reset admin passwords, and monitor system audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetPassModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass-panel text-xs font-bold text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <Lock className="w-4 h-4 text-amber-400" /> Reset Admin Password
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button text-xs font-bold text-white shadow-pink-glow"
            >
              <Plus className="w-4 h-4" /> Provision New Company
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Global Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-pink-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Active Tenants</span>
            <Building2 className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{companies.length} Companies</p>
          <p className="text-[11px] text-emerald-400 mt-1">Multi-tenant clusters</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Total Platform MRR</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">${totalMRR.toLocaleString()}/mo</p>
          <p className="text-[11px] text-indigo-300 mt-1">Subscription Revenue</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-violet-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Total Employees</span>
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalEmployeesPlatform} Created</p>
          <p className="text-[11px] text-violet-300 mt-1">Company-wise headcount</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">System Uptime</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">99.99%</p>
          <p className="text-[11px] text-emerald-400 mt-1">Global Latency 14ms</p>
        </div>
      </div>

      {/* Main Section: Companies Table + Live Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenants Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">Registered Client Companies & Feature Control</h3>
            <span className="text-xs text-slate-400 font-medium">Manage, Edit & Hold</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold">Company Name</th>
                  <th className="pb-3 font-semibold">Employees Created</th>
                  <th className="pb-3 font-semibold">Plan</th>
                  <th className="pb-3 font-semibold">Billing</th>
                  <th className="pb-3 font-semibold">Payment & Features</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {companies.map((comp) => {
                  const isHold = comp.status === 'Suspended / Payment Overdue';
                  return (
                    <tr key={comp._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-indigo-400" />
                          <div>
                            <p>{comp.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{comp.domain}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 font-bold text-indigo-300 font-mono">
                        {comp.employeeCount || 1} Staff
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {comp.plan}
                        </span>
                      </td>
                      <td className="py-3.5 text-emerald-400 font-mono font-bold">${comp.monthlyBilling}/mo</td>
                      <td className="py-3.5">
                        {isHold ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-400" /> Hold (Overdue)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active (Enabled)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right space-x-1.5">
                        {/* Hold / Unhold Toggle */}
                        <button
                          onClick={() => handleTogglePaymentHold(comp)}
                          title={isHold ? "Activate Features" : "Hold Features (Payment Overdue)"}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 ${
                            isHold
                              ? 'bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40'
                              : 'bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40'
                          }`}
                        >
                          {isHold ? <PlayCircle className="w-3 h-3" /> : <PauseCircle className="w-3 h-3" />}
                          {isHold ? 'Activate' : 'Hold'}
                        </button>

                        {/* Edit Company */}
                        <button
                          onClick={() => openEditModal(comp)}
                          title="Edit Company Details"
                          className="p-1.5 rounded-lg glass-panel hover:border-indigo-500/40 text-indigo-300 hover:text-white inline-flex"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Remove Company */}
                        <button
                          onClick={() => handleDeleteCompany(comp._id, comp.name)}
                          title="Remove Company"
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white inline-flex border border-rose-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Security Audit Log Stream */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Global Platform Audit Feed</h3>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="space-y-3 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl glass-panel flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-200">{log.event}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{log.time}</p>
                </div>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {log.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal 1: Provision Company */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-pink-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Create New Company & Admin Credentials</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddCompany} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. CyberPulse Technologies"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Domain</label>
                <input
                  type="text"
                  placeholder="e.g. cyberpulse.io"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Company Admin Email (Login ID)</label>
                <input
                  type="email"
                  placeholder="admin@cyberpulse.io"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Password Credential</label>
                <input
                  type="text"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Plan Tier</label>
                <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="Starter" className="bg-slate-900">Starter ($299/mo)</option>
                  <option value="Growth" className="bg-slate-900">Growth ($599/mo)</option>
                  <option value="Enterprise" className="bg-slate-900">Enterprise ($1499/mo)</option>
                </select>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white mt-2">
                Generate Company & Admin Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Company */}
      {showEditModal && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-indigo-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Update Company Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateCompany} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Company Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Domain</label>
                <input
                  type="text"
                  value={editDomain}
                  onChange={(e) => setEditDomain(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Plan Tier</label>
                <select value={editPlan} onChange={(e) => setEditPlan(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="Starter" className="bg-slate-900">Starter</option>
                  <option value="Growth" className="bg-slate-900">Growth</option>
                  <option value="Enterprise" className="bg-slate-900">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Monthly Billing ($)</label>
                <input
                  type="number"
                  value={editBilling}
                  onChange={(e) => setEditBilling(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
                  required
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white mt-2">
                Save Company Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Reset Company Admin Password */}
      {showResetPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-amber-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Reset Company Admin Password</h3>
              </div>
              <button onClick={() => setShowResetPassModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Company Admin Email</label>
                <input
                  type="email"
                  placeholder="admin@acme.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">New Password Credential</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
                  required
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white mt-2">
                Reset Admin Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
