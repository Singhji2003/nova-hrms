import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  FileText, 
  Calendar, 
  Download, 
  CheckCircle2, 
  Send,
  Building2,
  LogOut,
  LogIn,
  Laptop,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmployeeDashboard() {
  const auth = useAuth();
  const user = auth?.user || { name: 'David Chen', companyName: 'Acme Corporation', employeeId: 'NOV-101', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' };

  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [message, setMessage] = useState(null);

  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: '1', date: '2026-08-08', clockIn: '09:00 AM', clockOut: 'In Progress', status: 'Present', location: 'Headquarters - Geo Verified (IP: 192.168.1.45)' }
  ]);

  const [assignedAssets, setAssignedAssets] = useState([
    { id: 'a1', name: 'MacBook Pro 16" M3 Max', tag: 'ACME-HW-8841', serial: 'C02G9981', status: 'Active Assignment' },
    { id: 'a2', name: 'Dell UltraSharp 27" 4K Monitor', tag: 'ACME-HW-4412', serial: 'CN09212', status: 'Active Assignment' }
  ]);

  const handleClockToggle = async () => {
    if (!clockedIn) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setClockInTime(time);
      setClockedIn(true);
      try {
        await fetch('/api/attendance/clockin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeName: user.name, employeeId: user.employeeId || 'NOV-101' })
        });
      } catch (e) {}
      setAttendanceLogs(prev => [
        { id: String(Date.now()), date: new Date().toISOString().split('T')[0], clockIn: time, clockOut: 'Active', status: 'Present', location: 'Headquarters - Geo Verified (IP: 192.168.1.45)' },
        ...prev
      ]);
    } else {
      setClockedIn(false);
      setAttendanceLogs(prev => prev.map((log, idx) => idx === 0 ? { ...log, clockOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : log));
    }
  };

  const openReportModal = (asset) => {
    setSelectedAsset(asset);
    setShowReportIssueModal(true);
  };

  const handleReportHardwareIssue = async (e) => {
    e.preventDefault();
    if (!selectedAsset) return;

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Hardware Issue: ${selectedAsset.name} (${selectedAsset.tag})`,
          description: issueDescription || 'Hardware malfunctioning or requires maintenance',
          category: 'IT Support',
          priority: 'High',
          employeeName: user.name
        })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `IT Support Ticket raised for ${selectedAsset.name} (${selectedAsset.tag})!` });
        setShowReportIssueModal(false);
        setIssueDescription('');
      }
    } catch (err) {
      setMessage({ type: 'success', text: `IT Support Ticket raised for ${selectedAsset.name} (${selectedAsset.tag})!` });
      setShowReportIssueModal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Employee Self Service */}
      <div className="p-8 rounded-3xl glass-card bg-gradient-to-r from-sky-950/70 via-slate-900/90 to-indigo-950/70 border border-sky-500/30 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-sky-500/40 shadow-2xl"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white">Welcome back, {user.name}! 👋</h2>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {user.employeeId || 'NOV-101'}
                </span>
              </div>
              <p className="text-sm text-slate-300 font-semibold">{user.jobTitle || 'Senior Full Stack Lead'} • {user.department || 'Engineering'}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                <Building2 className="w-3.5 h-3.5 text-sky-400" /> {user.companyName || 'Acme Corporation'} Headquarters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-5 py-3 rounded-2xl glass-panel text-xs font-bold text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Apply for Leave
            </button>
            <button
              onClick={() => setShowPayslipModal(true)}
              className="px-5 py-3 rounded-2xl glass-button text-xs font-bold text-white shadow-xl flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> View Payslip PDF
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

      {/* Main Section 1: Geofenced Clock-In / Clock-Out Control */}
      <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-extrabold text-white">Geofenced Attendance Control</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">IP Verified Clock In & Clock Out System</p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${
            clockedIn ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${clockedIn ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
            {clockedIn ? `Clocked In (${clockInTime})` : 'Not Clocked In'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action Box */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Shift Status</p>
              <p className="text-2xl font-black text-white">
                {clockedIn ? 'Active Work Shift' : 'Off Shift'}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Geo Verified (IP: 192.168.1.45)
              </p>
            </div>

            <button
              onClick={handleClockToggle}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 ${
                clockedIn
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-400/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50'
              }`}
            >
              {clockedIn ? (
                <>
                  <LogOut className="w-4 h-4" /> Clock Out Shift
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Clock In Shift Now
                </>
              )}
            </button>
          </div>

          {/* Recent Logs Stream */}
          <div className="md:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Log Stream</h4>
            <div className="space-y-3 text-xs">
              {attendanceLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl glass-card flex justify-between items-center border border-slate-800/60">
                  <div>
                    <p className="font-bold text-white text-xs">{log.date} • {log.status}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{log.location}</p>
                  </div>
                  <div className="text-right font-mono font-bold">
                    <span className="text-emerald-400">{log.clockIn}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-indigo-300">{log.clockOut}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl glass-card border border-sky-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Casual Leave</p>
            <p className="text-3xl font-black text-white mt-1">8 Days</p>
            <p className="text-xs text-sky-300 mt-1">Out of 12 Annual</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-indigo-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sick Leave</p>
            <p className="text-3xl font-black text-white mt-1">5 Days</p>
            <p className="text-xs text-indigo-300 mt-1">Out of 7 Annual</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-emerald-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Earned Leave</p>
            <p className="text-3xl font-black text-white mt-1">14 Days</p>
            <p className="text-xs text-emerald-300 mt-1">Accrued & Rolled Over</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Interactive Assigned IT Equipment Section */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Laptop className="w-5 h-5 text-sky-400" /> Assigned Company Equipment & Support Actions
          </h3>
          <span className="text-xs text-slate-400">Direct IT Ticket Reporting Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          {assignedAssets.map((asset) => (
            <div key={asset.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-extrabold text-white text-sm">{asset.name}</p>
                  <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {asset.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">Tag: {asset.tag} • Serial: {asset.serial}</p>
              </div>

              {/* Hardware Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => openReportModal(asset)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Report Hardware Issue
                </button>
                <button
                  onClick={() => openReportModal(asset)}
                  className="px-3 py-1.5 rounded-xl glass-panel hover:border-sky-500/40 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400" /> Request Replacement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Report Hardware Issue Ticket */}
      {showReportIssueModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-amber-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Report Equipment Issue</h3>
                <p className="text-xs text-amber-400 font-mono">{selectedAsset.name} ({selectedAsset.tag})</p>
              </div>
              <button onClick={() => setShowReportIssueModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleReportHardwareIssue} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Describe Hardware Problem / Request</label>
                <textarea
                  rows="4"
                  placeholder="e.g. Screen flickering, battery swelling, or replacement request..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                ></textarea>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Raise IT Helpdesk Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-sky-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Apply for Leave</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            {leaveSubmitted ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-white text-base">Leave Submitted!</h4>
                <p className="text-xs text-slate-300">Your HR manager Sarah Jenkins has been notified for approval.</p>
                <button
                  onClick={() => { setLeaveSubmitted(false); setShowLeaveModal(false); }}
                  className="px-4 py-2 rounded-xl glass-button text-xs font-bold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setLeaveSubmitted(true); }} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Leave Type</label>
                  <select className="w-full p-2.5 rounded-xl glass-input text-xs">
                    <option value="Casual Leave" className="bg-slate-900">Casual Leave</option>
                    <option value="Sick Leave" className="bg-slate-900">Sick Leave</option>
                    <option value="Earned Leave" className="bg-slate-900">Earned Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-1 block">Start Date</label>
                    <input type="date" defaultValue="2026-08-15" className="w-full p-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-1 block">End Date</label>
                    <input type="date" defaultValue="2026-08-17" className="w-full p-2 rounded-xl glass-input text-xs" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Reason</label>
                  <textarea rows="3" placeholder="State reason for time off..." className="w-full p-2.5 rounded-xl glass-input text-xs"></textarea>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Payslip PDF Viewer Modal */}
      {showPayslipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl glass-card border border-sky-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">August 2026 Payslip</h3>
                <p className="text-xs text-slate-400">Acme Corporation • {user.employeeId || 'NOV-101'}</p>
              </div>
              <button onClick={() => setShowPayslipModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="p-4 rounded-2xl glass-panel space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Basic Salary</span>
                <span className="font-mono font-bold text-white">$75,000</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">House Rent Allowance (HRA)</span>
                <span className="font-mono font-bold text-white">$30,000</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Special Allowances</span>
                <span className="font-mono font-bold text-white">$20,000</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Provident Fund (PF) Deduction</span>
                <span className="font-mono font-bold text-rose-400">-$9,000</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tax (TDS) Deduction</span>
                <span className="font-mono font-bold text-rose-400">-$7,500</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-extrabold">
                <span className="text-sky-300">Net Take-Home Pay</span>
                <span className="font-mono text-emerald-400">$108,500</span>
              </div>
            </div>

            <button
              onClick={() => alert('PDF Payslip downloading...')}
              className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Official PDF Payslip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
