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
  Receipt,
  CalendarDays,
  FileCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpenOnMobile, onCloseMobileSidebar }) {
  const { currentRole } = useAuth();

  let sections = [];

  if (currentRole === 'superadmin') {
    sections = [
      {
        title: 'TENANT MANAGEMENT',
        items: [
          { label: 'Platform Control', path: '/', icon: Building, badge: 'Super Admin' },
          { label: 'Provision Companies', path: '/tenants', icon: Building2 },
        ]
      }
    ];
  } else if (currentRole === 'company') {
    sections = [
      {
        title: 'COMPANY OVERVIEW',
        items: [
          { label: 'Executive Dashboard', path: '/', icon: LayoutDashboard, badge: 'Overview' },
          { label: 'HR Managers Hub', path: '/hrs', icon: ShieldCheck, badge: 'HR Staff' },
          { label: 'Employee Directory', path: '/company-employees', icon: Users, badge: 'CRUD' },
        ]
      },
      {
        title: 'OPERATIONS & FINANCE',
        items: [
          { label: 'Attendance & Leaves', path: '/company-attendance', icon: Clock, badge: 'Charts' },
          { label: 'Payroll Summary', path: '/company-payroll', icon: DollarSign, badge: 'Payroll' },
          { label: 'Expense Claims', path: '/expenses', icon: Receipt, badge: 'Finance' },
          { label: 'Shift Roster Planner', path: '/shifts', icon: CalendarDays, badge: 'Shifts' },
          { label: 'Document Vault', path: '/documents', icon: FileCheck, badge: 'Vault' },
          { label: 'Helpdesk & Ratings', path: '/company-performance', icon: Award, badge: 'Metrics' },
        ]
      }
    ];
  } else if (currentRole === 'hr') {
    sections = [
      {
        title: 'HR CONTROL PANEL',
        items: [
          { label: 'HR Overview', path: '/', icon: LayoutDashboard, badge: 'Manager' },
          { label: 'Employees & Org Tree', path: '/employees', icon: Users },
          { label: 'Attendance & Leaves', path: '/leaves', icon: Clock },
          { label: 'Shift Roster Planner', path: '/shifts', icon: CalendarDays },
        ]
      },
      {
        title: 'RECRUITMENT & COMPLIANCE',
        items: [
          { label: 'Payroll & Taxes', path: '/payroll', icon: DollarSign },
          { label: 'Expense Reimbursements', path: '/expenses', icon: Receipt, badge: 'Claims' },
          { label: 'Document Vault', path: '/documents', icon: FileCheck },
          { label: 'AI ATS Talent Pipeline', path: '/ats', icon: Briefcase, badge: 'AI Match' },
          { label: 'Culture & Kudos', path: '/kudos', icon: HeartHandshake },
          { label: 'Helpdesk & IT Support', path: '/helpdesk', icon: HelpCircle },
        ]
      }
    ];
  } else {
    // Employee ESS
    sections = [
      {
        title: 'SELF SERVICE (ESS)',
        items: [
          { label: 'My ESS Portal', path: '/', icon: LayoutDashboard, badge: 'Portal' },
          { label: 'Colleagues Directory', path: '/employees', icon: Users },
          { label: 'Clock In & Time Off', path: '/leaves', icon: Clock },
          { label: 'My Shift Roster', path: '/shifts', icon: CalendarDays },
        ]
      },
      {
        title: 'PAYROLL & DOCUMENTS',
        items: [
          { label: 'Expense Claims', path: '/expenses', icon: Receipt },
          { label: 'My Documents Vault', path: '/documents', icon: FileCheck },
          { label: 'My Payslips PDF', path: '/payroll', icon: DollarSign },
          { label: 'Kudos & Recognition', path: '/kudos', icon: HeartHandshake },
        ]
      }
    ];
  }

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between md:hidden pb-3 border-b border-slate-800">
        <span className="text-xs font-black text-white uppercase tracking-wider">Navigation Menu</span>
        <button onClick={onCloseMobileSidebar} className="p-1 rounded-lg text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
              {section.title}
            </p>
            <nav className="space-y-1">
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={idx}
                    to={item.path}
                    onClick={onCloseMobileSidebar}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-sm font-black'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-sky-400 group-hover:scale-105 transition-transform" />
                      <span className="tracking-tight">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="w-64 bg-[#080d1a]/90 backdrop-blur-2xl border-r border-slate-800/80 p-5 min-h-[calc(100vh-61px)] flex-col justify-between hidden md:flex shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobileSidebar}
          ></div>
          <div className="relative w-72 bg-[#080d1a] border-r border-slate-800 p-5 min-h-full overflow-y-auto shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
