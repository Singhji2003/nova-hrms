import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, RotateCcw, CheckCircle2, Menu, X, Shield } from 'lucide-react';

export default function Navbar({ onToggleMobileSidebar, isMobileSidebarOpen }) {
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
    <header className="sticky top-0 z-40 w-full bg-[#080d1a]/90 backdrop-blur-2xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-md">
      {/* Brand Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl glass-panel text-sky-400 hover:text-white"
          title="Toggle Navigation Menu"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-violet-500 p-0.5 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
          <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-sky-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base tracking-tight text-white">Nova HRMS</h1>
            <span className="hidden sm:inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Enterprise
            </span>
          </div>
        </div>
      </div>

      {/* Role Switcher & Actions */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Reset Data Button */}
        <button
          onClick={handleResetData}
          disabled={resetting}
          title="Reset database to 1 clean sample record per feature"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold transition-all disabled:opacity-50"
        >
          {resetDone ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> <span className="hidden sm:inline">Data Clean</span>
            </>
          ) : (
            <>
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Reset Data</span>
            </>
          )}
        </button>

        {/* Role Switcher Segmented Control */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 px-2 font-bold uppercase tracking-wider hidden lg:inline">
            Role Scope:
          </span>

          <div className="flex items-center gap-1">
            {rolesConfig.map((r) => {
              const isActive = currentRole === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => switchRole(r.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-sky-500/30"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#080d1a]"></span>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-extrabold text-white">{user.name}</p>
            <p className="text-[10px] text-sky-400 font-semibold">{user.roleLabel || user.jobTitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
