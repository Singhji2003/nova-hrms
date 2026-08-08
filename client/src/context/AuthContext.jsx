import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const initialUserProfiles = {
  superadmin: {
    id: 'usr_super',
    name: 'Alexander Wright',
    role: 'superadmin',
    roleLabel: 'Super Admin',
    email: 'admin@novahrms.io',
    jobTitle: 'Super Platform Admin',
    companyName: 'Nova Global SaaS Hub',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  company: {
    id: 'usr_company',
    name: 'Victor Vance',
    role: 'company',
    roleLabel: 'Company Admin',
    email: 'admin@acme.com',
    jobTitle: 'Managing Director & CEO',
    companyName: 'Acme Corporation',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  hr: {
    id: 'usr_hr',
    name: 'Sarah Jenkins',
    role: 'hr',
    roleLabel: 'HR Manager',
    email: 'sarah.hr@acme.com',
    jobTitle: 'Head of Human Resources',
    companyName: 'Acme Corporation',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  employee: {
    id: 'usr_emp',
    name: 'David Chen',
    role: 'employee',
    roleLabel: 'Employee (ESS)',
    email: 'david.c@acme.com',
    jobTitle: 'Senior Full Stack Lead',
    companyName: 'Acme Corporation',
    employeeId: 'NOV-101',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialUserProfiles.company); // default to Company Admin
  const [currentRole, setCurrentRole] = useState('company');

  const switchRole = (newRole) => {
    if (initialUserProfiles[newRole]) {
      setCurrentRole(newRole);
      setUser(initialUserProfiles[newRole]);
    }
  };

  const loginUser = (userObj) => {
    setUser(userObj);
    setCurrentRole(userObj.role);
  };

  return (
    <AuthContext.Provider value={{ user, currentRole, switchRole, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
