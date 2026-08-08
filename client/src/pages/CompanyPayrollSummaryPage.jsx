import React from 'react';
import { DollarSign, FileText, Calculator, ArrowUpRight } from 'lucide-react';

export default function CompanyPayrollSummaryPage() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-emerald-950/70 via-slate-900/80 to-indigo-950/70 border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Dedicated Page
              </span>
              <span className="text-xs text-slate-400">Acme Corporation</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Company Payroll Expense Breakdown</h2>
            <p className="text-xs text-slate-300 mt-1">High-visibility breakdown of gross payroll expense, PF/TDS tax deductions, and net pay.</p>
          </div>

          <div className="p-3.5 rounded-2xl glass-panel text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Net Payroll Batch</p>
            <p className="text-2xl font-extrabold text-emerald-400">$108,500</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl glass-card space-y-6 border border-emerald-500/30">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" /> Monthly Payroll Expense Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-2xl glass-panel space-y-1">
            <p className="text-slate-400 font-medium">Total Monthly Gross Pay</p>
            <p className="text-3xl font-black text-white">$125,000</p>
            <p className="text-[11px] text-indigo-300 mt-1">Basic + HRA + Allowances</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel space-y-1">
            <p className="text-slate-400 font-medium">PF & Tax Deductions</p>
            <p className="text-3xl font-black text-rose-400">-$16,500</p>
            <p className="text-[11px] text-rose-300 mt-1">Statutory PF + TDS Taxes</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel space-y-1">
            <p className="text-slate-400 font-medium">Net Take-Home Pay</p>
            <p className="text-3xl font-black text-emerald-400">$108,500</p>
            <p className="text-[11px] text-emerald-300 mt-1">Disbursed to Employees</p>
          </div>
        </div>
      </div>
    </div>
  );
}
