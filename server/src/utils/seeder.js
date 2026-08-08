import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';
import Candidate from '../models/Candidate.js';
import Kudos from '../models/Kudos.js';
import Company from '../models/Company.js';
import Attendance from '../models/Attendance.js';
import Course from '../models/Course.js';
import Ticket from '../models/Ticket.js';

export const seedDatabase = async (forceReset = true) => {
  try {
    if (forceReset) {
      console.log('🔄 Wiping existing collections to reset data clean...');
      await User.deleteMany({});
      await Company.deleteMany({});
      await Employee.deleteMany({});
      await Attendance.deleteMany({});
      await Leave.deleteMany({});
      await Candidate.deleteMany({});
      await Kudos.deleteMany({});
      await Course.deleteMany({});
      await Ticket.deleteMany({});
    }

    console.log('🌱 Seeding 1 clean sample record per feature domain...');

    // 1. Company (1 Sample)
    const company = await Company.create({
      name: 'Acme Corporation',
      domain: 'acme.com',
      plan: 'Enterprise',
      employeeCount: 1,
      monthlyBilling: 1499,
      status: 'Active'
    });

    // 2. Users (1 Sample for each of the 4 Roles)
    await User.create([
      {
        name: 'Alexander Wright',
        email: 'admin@novahrms.io',
        password: 'password123',
        role: 'superadmin',
        jobTitle: 'Super Platform Admin',
        companyName: 'Nova Global SaaS Hub',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdBy: 'System Root'
      },
      {
        name: 'Victor Vance',
        email: 'admin@acme.com',
        password: 'password123',
        role: 'company',
        jobTitle: 'Company Admin / Director',
        companyName: 'Acme Corporation',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        createdBy: 'Super Admin'
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah.hr@acme.com',
        password: 'password123',
        role: 'hr',
        jobTitle: 'Head of Human Resources',
        department: 'Human Resources',
        companyName: 'Acme Corporation',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        createdBy: 'Company Admin'
      },
      {
        name: 'David Chen',
        email: 'david.c@acme.com',
        password: 'password123',
        role: 'employee',
        jobTitle: 'Senior Full Stack Lead',
        department: 'Engineering',
        employeeId: 'NOV-101',
        companyName: 'Acme Corporation',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        createdBy: 'HR Manager'
      }
    ]);

    // 3. Employee Salary & Org Roster Record (1 Sample)
    await Employee.create({
      name: 'David Chen',
      email: 'david.c@acme.com',
      employeeId: 'NOV-101',
      department: 'Engineering',
      designation: 'Senior Full Stack Lead',
      salary: { basic: 75000, hra: 30000, allowances: 20000, pfDeduction: 9000, taxDeduction: 7500 },
      manager: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    });

    // 4. Attendance Record (1 Sample)
    await Attendance.create({
      employeeName: 'David Chen',
      employeeId: 'NOV-101',
      date: new Date().toISOString().split('T')[0],
      clockIn: '09:00 AM',
      status: 'Present',
      location: 'Headquarters Geo Verified (IP: 192.168.1.45)',
      overtimeHours: 0
    });

    // 5. Leave Request (1 Sample)
    await Leave.create({
      employeeName: 'David Chen',
      employeeId: 'NOV-101',
      leaveType: 'Casual Leave',
      startDate: '2026-08-15',
      endDate: '2026-08-17',
      daysCount: 3,
      reason: 'Family occasion and wellness break',
      status: 'Pending'
    });

    // 6. Candidate ATS (1 Sample)
    await Candidate.create({
      name: 'Sophia Martinez',
      email: 'sophia.m@gmail.com',
      role: 'Senior React Developer',
      stage: 'Interview',
      aiMatchScore: 96,
      experienceYears: 6,
      skills: ['React', 'TypeScript', 'Tailwind', 'GraphQL'],
      resumeSummary: 'Exceptional match for frontend lead role with strong architecture experience.'
    });

    // 7. Kudos Social Feed (1 Sample)
    await Kudos.create({
      fromUser: 'Sarah Jenkins',
      fromAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      toUser: 'David Chen',
      toAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badge: '🌟 Innovation Champion',
      message: 'Huge thanks to David for architecting the clean multi-tenant role system! 🚀',
      likesCount: 12
    });

    // 8. LMS Course (1 Sample)
    await Course.create({
      title: 'ISO 27001 Security & Data Privacy',
      category: 'Compliance',
      duration: '1h 30m',
      modulesCount: 6,
      progress: 75,
      companyName: 'Acme Corporation'
    });

    // 9. IT Helpdesk Ticket (1 Sample)
    await Ticket.create({
      ticketId: 'TCK-201',
      subject: 'MacBook Pro M3 Max display flicker',
      category: 'IT Support',
      priority: 'High',
      status: 'In Progress',
      assignedAsset: 'MacBook Pro 16" M3 Max',
      employeeName: 'David Chen'
    });

    console.log('✅ Reset complete! 1 sample record seeded for all platform features.');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
