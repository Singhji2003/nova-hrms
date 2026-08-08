import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  DollarSign, 
  Briefcase, 
  HeartHandshake, 
  HelpCircle,
  Building,
  ShieldCheck,
  Building2,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { currentRole } = useAuth();

  let navItems = [];

  if (currentRole === 'superadmin') {
    navItems = [
      { label: 'Platform Control', path: '/', icon: Building, badge: 'Super Admin' },
      { label: 'Provision Companies', path: '/tenants', icon: Building2 },
    ];
  } else if (currentRole === 'company') {
    navItems = [
      { label: 'Company Overview', path: '/', icon: LayoutDashboard, badge: 'Overview' },
      { label: 'HR Managers Hub', path: '/hrs', icon: ShieldCheck, badge: 'HR Staff' },
      { label: 'Employee Directory', path: '/company-employees', icon: Users, badge: 'CRUD' },
      { label: 'Attendance & Leaves', path: '/company-attendance', icon: Clock, badge: 'Charts' },
      { label: 'Payroll Summary', path: '/company-payroll', icon: DollarSign, badge: 'Payroll' },
      { label: 'Helpdesk & Ratings', path: '/company-performance', icon: Award, badge: 'Metrics' },
    ];
  } else if (currentRole === 'hr') {
    navItems = [
      { label: 'HR Control Panel', path: '/', icon: LayoutDashboard, badge: 'Manager' },
      { label: 'Employees & Org', path: '/employees', icon: Users },
      { label: 'Attendance & Leaves', path: '/leaves', icon: Clock },
      { label: 'Payroll & Taxes', path: '/payroll', icon: DollarSign },
      { label: 'AI ATS (Talent)', path: '/ats', icon: Briefcase, badge: 'AI Match' },
      { label: 'Culture & Kudos', path: '/kudos', icon: HeartHandshake },
      { label: 'Helpdesk & IT', path: '/helpdesk', icon: HelpCircle },
    ];
  } else {
    // Employee ESS
    navItems = [
      { label: 'My ESS Portal', path: '/', icon: LayoutDashboard, badge: 'Self-Service' },
      { label: 'Colleagues & Directory', path: '/employees', icon: Users },
      { label: 'Clock In & Leaves', path: '/leaves', icon: Clock },
      { label: 'My Payslips', path: '/payroll', icon: DollarSign },
      { label: 'Kudos & Recognition', path: '/kudos', icon: HeartHandshake },
    ];
  }

  return (
    <aside className="w-60 bg-[#050811]/90 backdrop-blur-xl border-r border-slate-800/60 p-4 min-h-[calc(100vh-61px)] flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">
            Platform Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-indigo-400 group-hover:scale-105 transition-transform" />
                    <span className="tracking-tight">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3 rounded-xl glass-panel border border-slate-800/60 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-bold text-slate-200">Security Active</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          SOC2 Type II Verified Scope
        </p>
      </div>
    </aside>
  );
}
