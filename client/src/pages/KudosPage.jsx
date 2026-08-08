import React, { useState } from 'react';
import { HeartHandshake, Award, ThumbsUp, Send, Sparkles, MessageSquare, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KudosPage() {
  const [kudosList, setKudosList] = useState([
    {
      id: '1',
      fromUser: 'Sarah Jenkins',
      fromAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      toUser: 'David Chen',
      toAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: '🌟 Innovation Champion',
      message: 'Massive thanks to David for architecting our new fast micro-animation pipeline! 🚀',
      likes: 14
    },
    {
      id: '2',
      fromUser: 'Elena Rostova',
      fromAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      toUser: 'Sarah Jenkins',
      toAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      badge: '🚀 Team Player',
      message: 'Kudos to Sarah for streamlining the onboarding process for 15 new hires smoothly!',
      likes: 9
    }
  ]);

  const [toUser, setToUser] = useState('Elena Rostova');
  const [badge, setBadge] = useState('🌟 Innovation Champion');
  const [message, setMessage] = useState('');

  const handlePostKudos = (e) => {
    e.preventDefault();
    if (!message) return;
    setKudosList(prev => [
      {
        id: String(Date.now()),
        fromUser: 'David Chen',
        fromAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        toUser,
        toAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        badge,
        message,
        likes: 1
      },
      ...prev
    ]);
    setMessage('');
  };

  const handleLike = (id) => {
    setKudosList(prev => prev.map(k => k.id === id ? { ...k, likes: k.likes + 1 } : k));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-pink-950/70 via-slate-900/80 to-violet-950/70 border border-pink-500/30 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
              <HeartHandshake className="w-3 h-3" /> Peer-to-Peer Recognition
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Kudos Social Wall & eNPS Pulse</h2>
          <p className="text-xs text-slate-300 mt-1">Celebrate teammates and track Employee Net Promoter Score.</p>
        </div>

        {/* eNPS Gauge Pill */}
        <div className="p-3 rounded-2xl glass-panel border border-pink-500/40 text-center hidden sm:block">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Company eNPS Score</p>
          <p className="text-2xl font-extrabold text-gradient-pink mt-0.5">+72 Excellent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post Kudos Form */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-pink-400" /> Give Kudos to a Teammate
          </h3>

          <form onSubmit={handlePostKudos} className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Teammate</label>
              <select value={toUser} onChange={(e) => setToUser(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                <option value="Elena Rostova" className="bg-slate-900">Elena Rostova (Staff UX Architect)</option>
                <option value="Sarah Jenkins" className="bg-slate-900">Sarah Jenkins (Head of HR)</option>
                <option value="Marcus Vance" className="bg-slate-900">Marcus Vance (VP Sales)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Badge Type</label>
              <select value={badge} onChange={(e) => setBadge(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                <option value="🌟 Innovation Champion" className="bg-slate-900">🌟 Innovation Champion</option>
                <option value="🚀 Team Player" className="bg-slate-900">🚀 Team Player</option>
                <option value="🎯 Goal Crusher" className="bg-slate-900">🎯 Goal Crusher</option>
                <option value="💡 Problem Solver" className="bg-slate-900">💡 Problem Solver</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Message</label>
              <textarea
                rows="3"
                placeholder="What did your colleague do that wowed you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-input text-xs"
              ></textarea>
            </div>

            <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Broadcast Kudos
            </button>
          </form>
        </div>

        {/* Social Kudos Stream */}
        <div className="lg:col-span-2 space-y-4">
          {kudosList.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl glass-card border border-white/10 space-y-3 hover:border-pink-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={item.fromAvatar} alt={item.fromUser} className="w-10 h-10 rounded-xl object-cover ring-2 ring-pink-500/40" />
                  <div>
                    <p className="text-xs font-bold text-white">
                      {item.fromUser} <span className="text-slate-400 font-normal">recognized</span> {item.toUser}
                    </p>
                    <span className="text-[10px] font-bold text-pink-300 px-2 py-0.5 rounded bg-pink-500/20 border border-pink-500/30 inline-block mt-0.5">
                      {item.badge}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-200 pl-13 leading-relaxed">"{item.message}"</p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg glass-panel hover:border-pink-500/40 text-pink-300 font-bold text-[11px]"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> {item.likes} Appreciation High-Fives
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
