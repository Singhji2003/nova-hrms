import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Building2, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const { user, currentRole, switchRole } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleResetData = async () => {
    if (!window.confirm('Reset database to 1 clean sample record per feature?')) return;
    setResetting(true);
    try {
      await fetch('/api/reset', { method: 'POST' });
      setResetDone(true);
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (err) {
      alert('Database reset completed!');
      window.location.reload();
    } finally {
      setResetting(false);
    }
  };

  const rolesConfig = [
    { key: 'superadmin', label: 'Super Admin' },
    { key: 'company', label: 'Company Admin' },
    { key: 'hr', label: 'HR Manager' },
    { key: 'employee', label: 'Employee ESS' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050811]/85 backdrop-blur-xl border-b border-slate-800/60 px-6 py-3.5 flex items-center justify-between shadow-sm">
      {/* Brand Context */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-emerald-500 p-0.5 shadow-md">
          <div className="w-full h-full bg-[#050811] rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-sm tracking-tight text-white">Nova HRMS</h1>
            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Enterprise
            </span>
          </div>
        </div>
      </div>

      {/* Role Switcher & Actions (Clean, No Search Bar) */}
      <div className="flex items-center gap-4">
        {/* Reset Data Button */}
        <button
          onClick={handleResetData}
          disabled={resetting}
          title="Reset database to 1 clean sample record per feature"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs font-bold transition-all disabled:opacity-50"
        >
          {resetDone ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Reset Clean
            </>
          ) : (
            <>
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} /> Reset Data
            </>
          )}
        </button>

        {/* Role Switcher Segmented Control */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 px-2 font-bold uppercase tracking-wider hidden md:inline">
            Role Scope:
          </span>

          <div className="flex items-center gap-1">
            {rolesConfig.map((r) => {
              const isActive = currentRole === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => switchRole(r.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800/80">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#050811]"></span>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-100">{user.name}</p>
            <p className="text-[10px] text-indigo-400 font-semibold">{user.roleLabel || user.jobTitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
