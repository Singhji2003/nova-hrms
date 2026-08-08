import React from 'react';
import { HelpCircle, Award, Laptop, Star } from 'lucide-react';

export default function CompanyPerformanceHelpdeskPage() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-violet-950/70 via-slate-900/80 to-pink-950/70 border border-violet-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Dedicated Page
              </span>
              <span className="text-xs text-slate-400">Acme Corporation</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">IT Support Helpdesk & Employee Performance</h2>
            <p className="text-xs text-slate-300 mt-1">Track support tickets, hardware assets, and employee performance rating scores.</p>
          </div>

          <div className="p-3.5 rounded-2xl glass-panel text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Avg Performance</p>
            <p className="text-2xl font-extrabold text-pink-400">4.9 / 5.0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Helpdesk Support Overview */}
        <div className="p-6 rounded-3xl glass-card space-y-4 border border-violet-500/30">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-violet-400" /> IT Helpdesk Tickets & Assigned Hardware
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl glass-panel flex justify-between items-center border border-white/5">
              <div>
                <p className="font-extrabold text-white text-sm">TCK-201: MacBook Pro display flicker</p>
                <p className="text-xs text-slate-400 mt-1">Assigned: David Chen • Hardware Tag: ACME-HW-8841</p>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                In Progress
              </span>
            </div>
          </div>
        </div>

        {/* Employee Performance Overview */}
        <div className="p-6 rounded-3xl glass-card space-y-4 border border-pink-500/30">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-pink-400" /> Employee Performance Ratings & OKR Progress
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl glass-panel space-y-3 border border-white/5">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white text-sm">David Chen (Lead Full Stack Engineer)</span>
                <span className="text-pink-400 font-extrabold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-pink-400" /> 4.9 / 5.0
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">OKR Goal Achievement</span>
                  <span className="text-emerald-400 font-bold">98% Completed</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 w-[98%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
