import React, { useState } from 'react';
import { DollarSign, Download, Play, CheckCircle2, FileText, Calculator } from 'lucide-react';

export default function PayrollPage() {
  const [payrollRoster, setPayrollRoster] = useState([
    { id: 'NOV-101', name: 'David Chen', dept: 'Engineering', basic: 75000, hra: 30000, allowances: 20000, pf: 9000, tax: 7500 },
    { id: 'NOV-102', name: 'Elena Rostova', dept: 'Product & Design', basic: 70000, hra: 28000, allowances: 18000, pf: 8400, tax: 6800 },
    { id: 'NOV-103', name: 'Marcus Vance', dept: 'Sales & Growth', basic: 85000, hra: 34000, allowances: 25000, pf: 10200, tax: 9500 },
  ]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-emerald-950/70 via-slate-900/80 to-indigo-950/70 border border-emerald-500/30 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Automated Payroll Engine
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Payroll & Tax Compliance</h2>
          <p className="text-xs text-slate-300 mt-1">One-click batch processing with automated PF & TDS tax deduction rules.</p>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button text-xs font-bold text-white shadow-glass-glow">
          <Play className="w-4 h-4 text-emerald-300 fill-emerald-300" /> Execute August Batch Run
        </button>
      </div>

      {/* Roster Table */}
      <div className="p-5 rounded-2xl glass-card space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" /> Monthly Salary Structure & Deduction Roster
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3 font-semibold">Employee ID</th>
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Basic Pay</th>
                <th className="pb-3 font-semibold">HRA</th>
                <th className="pb-3 font-semibold">Allowances</th>
                <th className="pb-3 font-semibold">PF Deduction</th>
                <th className="pb-3 font-semibold">TDS Tax</th>
                <th className="pb-3 font-semibold">Net Take-Home</th>
                <th className="pb-3 font-semibold">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payrollRoster.map((emp) => {
                const gross = emp.basic + emp.hra + emp.allowances;
                const deductions = emp.pf + emp.tax;
                const net = gross - deductions;

                return (
                  <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-mono text-indigo-300 font-bold">{emp.id}</td>
                    <td className="py-3.5 font-bold text-white">{emp.name}</td>
                    <td className="py-3.5 text-slate-300 font-mono">${emp.basic.toLocaleString()}</td>
                    <td className="py-3.5 text-slate-300 font-mono">${emp.hra.toLocaleString()}</td>
                    <td className="py-3.5 text-slate-300 font-mono">${emp.allowances.toLocaleString()}</td>
                    <td className="py-3.5 text-rose-400 font-mono">-${emp.pf.toLocaleString()}</td>
                    <td className="py-3.5 text-rose-400 font-mono">-${emp.tax.toLocaleString()}</td>
                    <td className="py-3.5 text-emerald-400 font-mono font-extrabold text-sm">${net.toLocaleString()}</td>
                    <td className="py-3.5">
                      <button
                        onClick={() => alert(`Downloading Payslip for ${emp.name}`)}
                        className="px-2.5 py-1 rounded-lg glass-panel hover:border-emerald-500/40 text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
