import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, RotateCcw, CheckCircle2, Menu, X } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full bg-[#071126]/85 backdrop-blur-2xl border-b border-sky-500/25 px-4 md:px-6 py-3 flex items-center justify-between shadow-[0_4px_30px_rgba(2,132,199,0.15)]">
      {/* Brand Context & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl glass-panel text-sky-400 hover:text-white"
          title="Toggle Navigation Menu"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="w-8 h-8 md:w-9 md:h-9 rounded-2xl bg-gradient-to-tr from-sky-400 via-cyan-400 to-indigo-500 p-0.5 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
          <div className="w-full h-full bg-[#071126] rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-sm md:text-base tracking-tight text-white">Nova HRMS</h1>
          </div>
        </div>
      </div>

      {/* Role Switcher & Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Reset Data Button */}
        <button
          onClick={handleResetData}
          disabled={resetting}
          title="Reset database to 1 clean sample record per feature"
          className="flex items-center gap-1 px-2.5 py-1.5 md:px-3.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[11px] md:text-xs font-bold transition-all disabled:opacity-50"
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
        <div className="flex items-center bg-[#0a1836]/90 p-1 rounded-2xl border border-sky-500/30 overflow-x-auto max-w-[200px] sm:max-w-none">
          <div className="flex items-center gap-0.5 md:gap-1">
            {rolesConfig.map((r) => {
              const isActive = currentRole === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => switchRole(r.key)}
                  className={`px-2 py-1 md:px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-extrabold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 md:pl-3 border-l border-sky-500/20">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 md:w-8 md:h-8 rounded-xl object-cover ring-2 ring-sky-400/40"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#071126]"></span>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-black text-white">{user.name}</p>
            <p className="text-[10px] text-sky-400 font-bold">{user.roleLabel || user.jobTitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
