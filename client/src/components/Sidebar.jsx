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
  Award,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpenOnMobile, onCloseMobileSidebar }) {
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

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between md:hidden pb-3 border-b border-sky-500/20">
        <span className="text-xs font-black text-white uppercase tracking-wider">Navigation Menu</span>
        <button onClick={onCloseMobileSidebar} className="p-1 rounded-lg text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div>
        <p className="px-3 text-[10px] font-black text-sky-400/80 uppercase tracking-widest mb-3">
          Module Navigation
        </p>
        <nav className="space-y-1.5">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.path}
                onClick={onCloseMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                      : 'text-slate-300 hover:text-white hover:bg-sky-500/10'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="w-64 bg-[#071126]/80 backdrop-blur-2xl border-r border-sky-500/25 p-5 min-h-[calc(100vh-61px)] flex-col justify-between hidden md:flex shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobileSidebar}
          ></div>
          <div className="relative w-72 bg-[#071126] border-r border-sky-500/30 p-5 min-h-full overflow-y-auto shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
