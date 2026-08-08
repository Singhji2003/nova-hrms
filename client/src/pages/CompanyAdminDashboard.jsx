import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  BarChart3, 
  PieChart,
  ArrowUpRight,
  GitFork,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CompanyAdminDashboard() {
  const [hrsCount, setHrsCount] = useState(1);
  const [empCount, setEmpCount] = useState(1);

  const fetchData = async () => {
    try {
      const empRes = await fetch('/api/employees');
      const empData = await empRes.json();
      if (Array.isArray(empData)) {
        setEmpCount(empData.length);
      }

      const hrRes = await fetch('/api/users?role=hr');
      const hrData = await hrRes.json();
      if (Array.isArray(hrData)) {
        setHrsCount(hrData.length);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
      {/* Hero Header */}
      <div className="p-8 rounded-3xl glass-card bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-indigo-950/80 border border-sky-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Executive Command Overview
              </span>
              <span className="text-xs text-slate-400 font-medium">Acme Corporation</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Company Overview & Analytics</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Real-time executive metrics, attendance ratio bar charts, payroll distribution, and hierarchical organization tree.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl glass-panel text-center min-w-[130px] border border-sky-500/20">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">HR Managers</p>
              <p className="text-2xl font-black text-sky-400 mt-0.5">{hrsCount}</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel text-center min-w-[130px] border border-indigo-500/20">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Staff</p>
              <p className="text-2xl font-black text-indigo-400 mt-0.5">{empCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl glass-card glass-card-hover border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Staff</span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{empCount}</p>
          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> Active Staff Roster
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-6 rounded-3xl glass-card glass-card-hover border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Payroll</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">$108,500</p>
          <p className="text-xs text-emerald-400 font-bold mt-2">Net Take-Home Pay</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-3xl glass-card glass-card-hover border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">HR Managers</span>
            <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{hrsCount}</p>
          <p className="text-xs text-sky-300 font-bold mt-2">Active HR Governance</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-6 rounded-3xl glass-card glass-card-hover border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">100%</p>
          <p className="text-xs text-cyan-300 font-bold mt-2">Geo Verified Logins</p>
        </motion.div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Ratio Visual Bar Chart */}
        <div className="p-6 rounded-3xl glass-card space-y-5 border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-extrabold text-white">Daily Attendance Ratio Chart</h3>
            </div>
            <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              100% Verified
            </span>
          </div>

          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">On-Time Geo Logins</span>
                <span className="text-emerald-400">100% (1 Staff)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full"></div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Late Logins</span>
                <span className="text-amber-400">0%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-amber-500 rounded-full w-0"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Payroll Distribution Chart */}
        <div className="p-6 rounded-3xl glass-card space-y-5 border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-extrabold text-white">Department Payroll Distribution</h3>
            </div>
            <span className="text-xs font-bold text-indigo-300">$125,000 Gross</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Engineering Department</span>
                <span className="text-indigo-400">60% ($75,000)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-indigo-500 rounded-full w-[60%]"></div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Product & Design</span>
                <span className="text-violet-400">25% ($31,250)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-violet-500 rounded-full w-[25%]"></div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Human Resources</span>
                <span className="text-sky-400">15% ($18,750)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-sky-500 rounded-full w-[15%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Employee Org Hierarchy Tree Section */}
      <div className="p-8 rounded-3xl glass-card border border-slate-800 text-center space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <GitFork className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-extrabold text-white">Hierarchical Organization Tree</h3>
          </div>
          <span className="text-xs font-bold text-sky-300 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
            Manager $\rightarrow$ Reportees Tree
          </span>
        </div>

        {/* Level 1: Company Admin / CEO */}
        <div className="inline-block p-4 rounded-2xl glass-panel border border-sky-500/40 bg-sky-950/20 shadow-lg">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" className="w-14 h-14 rounded-2xl object-cover mx-auto mb-2 ring-2 ring-sky-400 shadow-md" />
          <h4 className="font-extrabold text-sm text-white">Victor Vance</h4>
          <p className="text-xs text-sky-300 font-semibold">Company Admin & CEO</p>
        </div>

        <div className="w-0.5 h-8 bg-sky-500/40 mx-auto"></div>

        {/* Level 2: HR Manager & Department Leads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6 text-left">
          <div className="p-5 rounded-2xl glass-panel border border-indigo-500/40 bg-indigo-950/20 space-y-3">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500" />
              <div>
                <h4 className="font-extrabold text-xs text-white">Sarah Jenkins</h4>
                <p className="text-[10px] text-indigo-300 font-semibold">Head of Human Resources</p>
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
    </motion.div>
  );
}
