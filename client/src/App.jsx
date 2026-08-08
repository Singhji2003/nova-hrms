import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardSwitch from './pages/DashboardSwitch';
import EmployeesPage from './pages/EmployeesPage';
import PayrollPage from './pages/PayrollPage';
import AtsPipeline from './pages/AtsPipeline';
import KudosPage from './pages/KudosPage';
import HelpdeskPage from './pages/HelpdeskPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CompanyHrManagementPage from './pages/CompanyHrManagementPage';
import CompanyEmployeeCrudPage from './pages/CompanyEmployeeCrudPage';
import CompanyAttendanceLeavesPage from './pages/CompanyAttendanceLeavesPage';
import CompanyPayrollSummaryPage from './pages/CompanyPayrollSummaryPage';
import CompanyPerformanceHelpdeskPage from './pages/CompanyPerformanceHelpdeskPage';

export default function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#060d1e] text-slate-100 font-sans">
        <Navbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />

        <div className="flex flex-1 relative">
          <Sidebar
            isOpenOnMobile={isMobileSidebarOpen}
            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
          />

          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardSwitch />} />
              <Route path="/hrs" element={<CompanyHrManagementPage />} />
              <Route path="/company-employees" element={<CompanyEmployeeCrudPage />} />
              <Route path="/company-attendance" element={<CompanyAttendanceLeavesPage />} />
              <Route path="/company-payroll" element={<CompanyPayrollSummaryPage />} />
              <Route path="/company-performance" element={<CompanyPerformanceHelpdeskPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/leaves" element={<CompanyAttendanceLeavesPage />} />
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/ats" element={<AtsPipeline />} />
              <Route path="/kudos" element={<KudosPage />} />
              <Route path="/helpdesk" element={<HelpdeskPage />} />
              <Route path="/tenants" element={<SuperAdminDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
