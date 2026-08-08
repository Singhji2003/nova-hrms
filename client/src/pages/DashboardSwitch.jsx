import React from 'react';
import { useAuth } from '../context/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import CompanyAdminDashboard from './CompanyAdminDashboard';
import HRDashboard from './HRDashboard';
import EmployeeDashboard from './EmployeeDashboard';

export default function DashboardSwitch() {
  const { currentRole } = useAuth();

  switch (currentRole) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    case 'company':
      return <CompanyAdminDashboard />;
    case 'hr':
      return <HRDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    default:
      return <CompanyAdminDashboard />;
  }
}
