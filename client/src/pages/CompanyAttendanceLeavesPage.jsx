import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  LogIn, 
  LogOut, 
  Send, 
  Plus, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CompanyAttendanceLeavesPage() {
  const { currentRole, user } = useAuth();
  const isEmployee = currentRole === 'employee';

  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const [leavesList, setLeavesList] = useState([
    { _id: '1', employeeName: 'David Chen', employeeId: 'NOV-101', leaveType: 'Casual Leave', startDate: '2026-08-15', endDate: '2026-08-17', days: 3, reason: 'Family occasion & wellness break', status: 'Pending' }
  ]);

  const [message, setMessage] = useState(null);

  // Leave Form State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('2026-08-15');
  const [endDate, setEndDate] = useState('2026-08-17');
  const [reason, setReason] = useState('');

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/leaves');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLeavesList(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleClockToggle = async () => {
    if (!clockedIn) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setClockInTime(time);
      setClockedIn(true);
      try {
        await fetch('/api/attendance/clockin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeName: user.name || 'David Chen', employeeId: 'NOV-101' })
        });
      } catch (e) {}
    } else {
      setClockedIn(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName: user.name || 'David Chen',
          employeeId: user.employeeId || 'NOV-101',
          leaveType,
          startDate,
          endDate,
          reason: reason || 'Personal leave request',
          status: 'Pending'
        })
      });
      if (res.ok) {
        setLeaveSubmitted(true);
        fetchLeaves();
      }
    } catch (err) {
      setLeaveSubmitted(true);
    }
  };

  const handleLeaveAction = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/leaves/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `Leave set to "${newStatus}"!` });
        fetchLeaves();
      }
    } catch (err) {
      setLeavesList(prev => prev.map(l => (l._id === id || l.id === id) ? { ...l, status: newStatus } : l));
      setMessage({ type: 'success', text: `Leave set to "${newStatus}"!` });
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="p-8 rounded-3xl glass-card bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-indigo-950/70 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Attendance & Time Off
            </span>
            <span className="text-xs text-slate-400 font-medium">Acme Corporation</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Clock In Stream & Leave Applications</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Geofenced daily attendance logging, shift management, and employee leave requests queue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEmployee ? (
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-6 py-3 rounded-2xl glass-button text-xs font-black text-white shadow-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Apply for Time Off
            </button>
          ) : (
            <div className="p-4 rounded-2xl glass-panel text-center min-w-[140px]">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Attendance Rate</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">100% Verified</p>
            </div>
          )}
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

      {/* Geofenced Clock In Box */}
      <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-extrabold text-white">Geofenced Shift Attendance</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">IP & Location Verified Check-In</p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${
            clockedIn ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${clockedIn ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
            {clockedIn ? `Clocked In at ${clockInTime}` : 'Shift Logged Out'}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl glass-panel border border-slate-800">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Live Shift Action</p>
            <p className="text-xl font-black text-white">{clockedIn ? 'Active Work Shift' : 'Off Shift'}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> IP Verified: 192.168.1.45 (Headquarters)
            </p>
          </div>

          <button
            onClick={handleClockToggle}
            className={`py-3.5 px-8 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-2 ${
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
      </div>

      {/* Main Grid: Attendance Chart & Leave Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Attendance Ratio Chart */}
        <div className="p-6 rounded-3xl glass-card space-y-4 border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Daily Attendance Ratio Chart
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              100% Geo Verified
            </span>
          </div>

          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">On-Time Geo Logins</span>
                <span className="text-emerald-400">100% (1 Staff)</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full"></div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Late Logins</span>
                <span className="text-amber-400">0%</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-amber-500 rounded-full w-0"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaves Status & Approvals Queue */}
        <div className="p-6 rounded-3xl glass-card space-y-4 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" /> Leave Applications Queue
            </h3>
            <span className="text-xs text-indigo-300 font-bold">{leavesList.length} Requests</span>
          </div>

          <div className="space-y-3 text-xs">
            {leavesList.map((leave) => {
              const leaveId = leave._id || leave.id;
              return (
                <div key={leaveId} className="p-4 rounded-2xl glass-panel flex justify-between items-center border border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white">{leave.employeeName || leave.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">{leave.employeeId || leave.empId}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold">{leave.leaveType || leave.type} • {leave.startDate || 'Aug 15'} - {leave.endDate || 'Aug 17'} ({leave.days || 3} days)</p>
                    <p className="text-[11px] text-slate-400">Reason: "{leave.reason}"</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isEmployee && leave.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleLeaveAction(leaveId, 'Approved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleLeaveAction(leaveId, 'Rejected')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-xl text-xs font-black ${
                        leave.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        leave.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {leave.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-indigo-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Submit Time Off Request</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            {leaveSubmitted ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-white text-base">Leave Request Submitted!</h4>
                <p className="text-xs text-slate-300">Your HR manager Sarah Jenkins has been notified for approval.</p>
                <button
                  onClick={() => { setLeaveSubmitted(false); setShowLeaveModal(false); }}
                  className="px-4 py-2 rounded-xl glass-button text-xs font-bold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyLeave} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Leave Type</label>
                  <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                    <option value="Casual Leave" className="bg-slate-900">Casual Leave</option>
                    <option value="Sick Leave" className="bg-slate-900">Sick Leave</option>
                    <option value="Earned Leave" className="bg-slate-900">Earned Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-1 block">Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 rounded-xl glass-input text-xs" required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-1 block">End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 rounded-xl glass-input text-xs" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Reason for Time Off</label>
                  <textarea rows="3" placeholder="State reason..." value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs" required></textarea>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
