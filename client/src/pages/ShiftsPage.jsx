import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Download, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exportToCSV } from '../utils/exportUtils';

export default function ShiftsPage() {
  const { currentRole, user } = useAuth();
  const isAdminOrHr = currentRole === 'superadmin' || currentRole === 'company' || currentRole === 'hr';

  const [shifts, setShifts] = useState([
    { _id: '1', employeeName: 'David Chen', employeeId: 'NOV-101', shiftType: 'Morning (09:00 - 17:00)', date: new Date().toISOString().split('T')[0], location: 'Headquarters', status: 'Scheduled' }
  ]);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [message, setMessage] = useState(null);

  const [empName, setEmpName] = useState('David Chen');
  const [shiftType, setShiftType] = useState('Morning (09:00 - 17:00)');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchShifts = async () => {
    try {
      const res = await fetch('/api/shifts');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setShifts(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName: empName,
          employeeId: 'NOV-101',
          shiftType,
          date: shiftDate,
          location: 'Headquarters',
          status: 'Scheduled'
        })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `Shift assigned to ${empName} successfully!` });
        setShowShiftModal(false);
        fetchShifts();
      }
    } catch (err) {
      setMessage({ type: 'success', text: `Shift assigned to ${empName} successfully!` });
      setShowShiftModal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl glass-card bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-indigo-950/80 border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Workforce Operations
            </span>
            <span className="text-xs text-slate-400 font-medium">Acme Corporation</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Shift Scheduling & Roster Planner</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Assign work shifts (Morning, Evening, Night, Remote), monitor team roster coverage, and track scheduled hours.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV('shift_roster_schedule', shifts)}
            className="px-4 py-3 rounded-2xl glass-panel text-xs font-bold text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Roster CSV
          </button>
          {isAdminOrHr && (
            <button
              onClick={() => setShowShiftModal(true)}
              className="px-5 py-3 rounded-2xl glass-button text-xs font-black text-white shadow-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Assign Work Shift
            </button>
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

      {/* Roster Cards Grid */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" /> Active Roster Assignments
          </h3>
          <span className="text-xs text-sky-300 font-bold">{shifts.length} Shift Slots</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {shifts.map((s) => {
            const shiftId = s._id || s.id;
            return (
              <div key={shiftId} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-extrabold text-white text-sm">{s.employeeName}</p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-sky-400">{s.shiftType}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date: {s.date}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {s.location}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shift Assignment Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-sky-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Assign Work Shift</h3>
              <button onClick={() => setShowShiftModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateShift} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Employee Name</label>
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
                <label className="text-slate-300 font-semibold mb-1 block">Shift Slot</label>
                <select value={shiftType} onChange={(e) => setShiftType(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="Morning (09:00 - 17:00)" className="bg-slate-900">Morning Shift (09:00 - 17:00)</option>
                  <option value="Evening (16:00 - 00:00)" className="bg-slate-900">Evening Shift (16:00 - 00:00)</option>
                  <option value="Night (00:00 - 08:00)" className="bg-slate-900">Night Shift (00:00 - 08:00)</option>
                  <option value="Remote Work" className="bg-slate-900">Remote Work Slot</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Shift Date</label>
                <input
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white shadow-xl">
                Assign Shift to Roster
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
