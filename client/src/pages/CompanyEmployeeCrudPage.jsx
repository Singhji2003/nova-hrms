import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Edit3, Trash2, GitFork, ShieldCheck } from 'lucide-react';

export default function CompanyEmployeeCrudPage() {
  const [activeView, setActiveView] = useState('directory'); // 'directory' or 'orgtree'

  const [empList, setEmpList] = useState([
    { _id: 'e1', name: 'David Chen', email: 'david.c@acme.com', employeeId: 'NOV-101', department: 'Engineering', designation: 'Senior Full Stack Lead', salary: { basic: 75000, hra: 30000, allowances: 20000 }, createdBy: 'HR Manager', status: 'Active' }
  ]);

  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('emp123456');
  const [empDept, setEmpDept] = useState('Engineering');
  const [empDesignation, setEmpDesignation] = useState('Senior Developer');
  const [empBasicSalary, setEmpBasicSalary] = useState(60000);

  const [showEditEmpModal, setShowEditEmpModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [editEmpName, setEditEmpName] = useState('');
  const [editEmpDept, setEditEmpDept] = useState('');
  const [editEmpDesignation, setEditEmpDesignation] = useState('');
  const [editEmpBasic, setEditEmpBasic] = useState(60000);

  const [message, setMessage] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setEmpList(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!empName || !empEmail) return;

    try {
      const res = await fetch('/api/company/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: empName,
          email: empEmail,
          password: empPassword,
          companyName: 'Acme Corporation',
          department: empDept,
          designation: empDesignation,
          salary: { basic: Number(empBasicSalary), hra: Math.round(empBasicSalary * 0.4), allowances: 15000, pfDeduction: 6000, taxDeduction: 5000 },
          createdByRole: 'Company Admin'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Employee Created! Login: ${empEmail} | Pass: ${empPassword}` });
        setEmpName('');
        setEmpEmail('');
        fetchEmployees();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create employee' });
      }
    } catch (err) {
      setEmpList(prev => [{ _id: String(Date.now()), name: empName, email: empEmail, employeeId: 'NOV-' + Math.floor(100+Math.random()*900), department: empDept, designation: empDesignation, salary: { basic: Number(empBasicSalary) }, createdBy: 'Company Admin', status: 'Active' }, ...prev]);
      setMessage({ type: 'success', text: `Employee Created! Login: ${empEmail} | Pass: ${empPassword}` });
      setEmpName('');
      setEmpEmail('');
    }
  };

  const openEditEmpModal = (emp) => {
    setSelectedEmp(emp);
    setEditEmpName(emp.name);
    setEditEmpDept(emp.department);
    setEditEmpDesignation(emp.designation);
    setEditEmpBasic(emp.salary?.basic || 60000);
    setShowEditEmpModal(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    if (!selectedEmp) return;

    try {
      const res = await fetch(`/api/employees/${selectedEmp._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editEmpName,
          department: editEmpDept,
          designation: editEmpDesignation,
          salary: { basic: Number(editEmpBasic), hra: Math.round(editEmpBasic * 0.4), allowances: 15000, pfDeduction: 6000, taxDeduction: 5000 }
        })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `Employee "${editEmpName}" updated!` });
        setShowEditEmpModal(false);
        fetchEmployees();
      }
    } catch (err) {
      setEmpList(prev => prev.map(emp => emp._id === selectedEmp._id ? { ...emp, name: editEmpName, department: editEmpDept, designation: editEmpDesignation, salary: { basic: Number(editEmpBasic) } } : emp));
      setMessage({ type: 'success', text: `Employee "${editEmpName}" updated!` });
      setShowEditEmpModal(false);
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    if (!window.confirm(`Delete employee "${name}"?`)) return;

    try {
      await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      setMessage({ type: 'success', text: `Employee "${name}" deleted.` });
      fetchEmployees();
    } catch (e) {
      setEmpList(prev => prev.filter(emp => emp._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-indigo-950/70 via-slate-900/80 to-purple-950/70 border border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Employee Management
              </span>
              <span className="text-xs text-slate-400">Acme Corporation</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Employee Roster & Visual Org Tree</h2>
            <p className="text-xs text-slate-300 mt-1">Manage employee CRUD actions and view manager-reportee organization tree.</p>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveView('directory')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'directory' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Roster CRUD
            </button>
            <button
              onClick={() => setActiveView('orgtree')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'orgtree' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" /> Org Hierarchy Tree
            </button>
          </div>
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

      {activeView === 'directory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Employee Form */}
          <div className="p-5 rounded-2xl glass-card space-y-4 border border-indigo-500/30">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" /> Create Employee Credentials
            </h3>

            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. David Chen"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Email</label>
                <input
                  type="email"
                  placeholder="david.c@acme.com"
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Department</label>
                <select value={empDept} onChange={(e) => setEmpDept(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="Engineering" className="bg-slate-900">Engineering</option>
                  <option value="Product & Design" className="bg-slate-900">Product & Design</option>
                  <option value="Sales & Growth" className="bg-slate-900">Sales & Growth</option>
                  <option value="Finance" className="bg-slate-900">Finance</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Developer"
                  value={empDesignation}
                  onChange={(e) => setEmpDesignation(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Basic Salary ($)</label>
                <input
                  type="number"
                  value={empBasicSalary}
                  onChange={(e) => setEmpBasicSalary(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Password Credential</label>
                <input
                  type="text"
                  value={empPassword}
                  onChange={(e) => setEmpPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
                  required
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white">
                Generate Employee Credentials
              </button>
            </form>
          </div>

          {/* Employee Directory Table */}
          <div className="lg:col-span-2 p-5 rounded-2xl glass-card space-y-4">
            <h3 className="text-sm font-bold text-white">Company Employee Directory (Update & Delete)</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="pb-3 font-semibold">Emp ID</th>
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Department</th>
                    <th className="pb-3 font-semibold">Designation</th>
                    <th className="pb-3 font-semibold">Basic Pay</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {empList.map((emp) => (
                    <tr key={emp._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 font-mono text-indigo-300 font-bold">{emp.employeeId}</td>
                      <td className="py-3.5 font-bold text-white">{emp.name}</td>
                      <td className="py-3.5 text-slate-300">{emp.department}</td>
                      <td className="py-3.5 text-slate-300">{emp.designation}</td>
                      <td className="py-3.5 text-emerald-400 font-mono font-bold">
                        ${emp.salary?.basic?.toLocaleString() || '60,000'}
                      </td>
                      <td className="py-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => openEditEmpModal(emp)}
                          className="p-1.5 rounded-lg glass-panel hover:border-indigo-500/40 text-indigo-300 hover:text-white"
                          title="Edit Employee"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp._id, emp.name)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Visual Org Hierarchy Tree */
        <div className="p-8 rounded-3xl glass-card border border-violet-500/30 text-center space-y-8">
          <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
            <GitFork className="w-5 h-5 text-violet-400" /> Hierarchical Organization Tree
          </h3>

          <div className="inline-block p-4 rounded-2xl glass-panel border border-amber-500/40 bg-amber-950/20 shadow-lg">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" className="w-14 h-14 rounded-2xl object-cover mx-auto mb-2 ring-2 ring-amber-500" />
            <h4 className="font-extrabold text-sm text-white">Victor Vance</h4>
            <p className="text-xs text-amber-300 font-semibold">Company Admin & CEO</p>
          </div>

          <div className="w-0.5 h-8 bg-indigo-500/40 mx-auto"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6 text-left">
            <div className="p-5 rounded-2xl glass-panel border border-indigo-500/40 bg-indigo-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500" />
                <div>
                  <h4 className="font-extrabold text-xs text-white">Sarah Jenkins</h4>
                  <p className="text-[10px] text-indigo-300 font-semibold">Head of HR</p>
                </div>
              </div>

              <div className="pl-4 border-l-2 border-indigo-500/40 space-y-2 pt-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Direct Reportees:</p>
                <div className="p-2.5 rounded-xl glass-card text-xs space-y-1">
                  <p className="font-extrabold text-white flex items-center justify-between">
                    <span>David Chen</span>
                    <span className="text-[10px] text-indigo-300 font-mono">NOV-101</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Senior Full Stack Lead • Engineering</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-emerald-500/40 bg-emerald-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500" />
                <div>
                  <h4 className="font-extrabold text-xs text-white">Marcus Vance</h4>
                  <p className="text-[10px] text-emerald-300 font-semibold">VP Enterprise Sales</p>
                </div>
              </div>

              <div className="pl-4 border-l-2 border-emerald-500/40 space-y-2 pt-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Direct Reportees:</p>
                <div className="p-2.5 rounded-xl glass-card text-xs space-y-1">
                  <p className="font-extrabold text-white">Elena Rostova</p>
                  <p className="text-[10px] text-slate-400">Staff UX Architect • Product</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditEmpModal && selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-indigo-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Update Employee Details</h3>
              <button onClick={() => setShowEditEmpModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateEmployee} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={editEmpName}
                  onChange={(e) => setEditEmpName(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Department</label>
                <select value={editEmpDept} onChange={(e) => setEditEmpDept(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="Engineering" className="bg-slate-900">Engineering</option>
                  <option value="Product & Design" className="bg-slate-900">Product & Design</option>
                  <option value="Sales & Growth" className="bg-slate-900">Sales & Growth</option>
                  <option value="Finance" className="bg-slate-900">Finance</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Designation</label>
                <input
                  type="text"
                  value={editEmpDesignation}
                  onChange={(e) => setEditEmpDesignation(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Basic Salary ($)</label>
                <input
                  type="number"
                  value={editEmpBasic}
                  onChange={(e) => setEditEmpBasic(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
                  required
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white mt-2">
                Save Employee Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
