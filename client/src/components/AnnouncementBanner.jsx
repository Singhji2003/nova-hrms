import React, { useState, useEffect } from 'react';
import { Megaphone, X, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AnnouncementBanner() {
  const { currentRole } = useAuth();
  const isAdminOrHr = currentRole === 'superadmin' || currentRole === 'company' || currentRole === 'hr';

  const [announcements, setAnnouncements] = useState([
    { _id: '1', title: 'Q3 Enterprise All-Hands & Town Hall Meeting', message: 'Join us live this Friday at 3 PM EST for product roadmap updates and team recognition awards.', priority: 'Important', author: 'Company HR' }
  ]);
  const [dismissed, setDismissed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Important');

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setAnnouncements(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, priority, author: 'Company HR' })
      });
      if (res.ok) {
        setShowCreateModal(false);
        setTitle('');
        setMessage('');
        fetchAnnouncements();
      }
    } catch (err) {
      setShowCreateModal(false);
    }
  };

  if (dismissed || announcements.length === 0) return null;

  const current = announcements[0];

  return (
    <div className="mb-6 relative">
      <div className="p-4 rounded-2xl glass-card bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-indigo-950/80 border border-sky-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
            <Megaphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {current.priority || 'Broadcast'}
              </span>
              <h4 className="text-sm font-black text-white">{current.title}</h4>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{current.message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {isAdminOrHr && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-xl glass-panel text-[11px] font-bold text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Broadcast New
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white"
            title="Dismiss Announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Broadcast Creation Modal for HR / Admin */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-sky-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-sky-400" /> Broadcast Company Announcement
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Announcement Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Town Hall & Holiday Policy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Priority Level</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="Normal" className="bg-slate-900">Normal Announcement</option>
                  <option value="Important" className="bg-slate-900">Important</option>
                  <option value="Urgent" className="bg-slate-900">Urgent Broadcast</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Announcement Message</label>
                <textarea
                  rows="3"
                  placeholder="State broadcast details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                ></textarea>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white shadow-xl">
                Publish Broadcast Announcement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
