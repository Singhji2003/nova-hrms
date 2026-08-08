import User from '../models/User.js';
import Company from '../models/Company.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Candidate from '../models/Candidate.js';
import Kudos from '../models/Kudos.js';
import Ticket from '../models/Ticket.js';
import Expense from '../models/Expense.js';
import Shift from '../models/Shift.js';
import Announcement from '../models/Announcement.js';
import Document from '../models/Document.js';

export async function seedDatabase(forceReset = false) {
  try {
    const userCount = await User.countDocuments();
    if (!forceReset && userCount > 0) {
      console.log('🌱 Database already initialized with records.');
      return;
    }

    if (forceReset) {
      console.log('🔄 Wiping existing collections to reset data clean...');
      await User.deleteMany({});
      await Company.deleteMany({});
      await Employee.deleteMany({});
      await Attendance.deleteMany({});
      await Leave.deleteMany({});
      await Candidate.deleteMany({});
      await Kudos.deleteMany({});
      await Ticket.deleteMany({});
      await Expense.deleteMany({});
      await Shift.deleteMany({});
      await Announcement.deleteMany({});
      await Document.deleteMany({});
    }

    console.log('🌱 Seeding 1 clean sample record per feature domain...');

    // 1. Company
    const company = new Company({
      name: 'Acme Corporation',
      domain: 'acme.com',
      plan: 'Enterprise',
      employeeCount: 1,
      monthlyBilling: 1499,
      status: 'Active',
      featuresEnabled: true
    });
    await company.save();

    // 2. Super Admin User
    const superAdmin = new User({
      name: 'Global Platform Admin',
      email: 'admin@nova-hrms.com',
      password: 'adminpassword123',
      role: 'superadmin',
      jobTitle: 'Chief Platform Officer',
      companyName: 'Nova Enterprise Cloud',
      department: 'Platform Ops'
    });
    await superAdmin.save();

    // 3. Company Admin User
    const companyAdmin = new User({
      name: 'Victor Vance',
      email: 'victor.admin@acme.com',
      password: 'company123456',
      role: 'company',
      jobTitle: 'Managing Director & CEO',
      companyName: 'Acme Corporation',
      department: 'Executive'
    });
    await companyAdmin.save();

    // 4. HR Manager User
    const hrUser = new User({
      name: 'Sarah Jenkins',
      email: 'sarah.hr@acme.com',
      password: 'hrpassword123',
      role: 'hr',
      jobTitle: 'Head of Human Resources',
      companyName: 'Acme Corporation',
      department: 'Human Resources',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    });
    await hrUser.save();

    // 5. Employee User
    const empUser = new User({
      name: 'David Chen',
      email: 'david.c@acme.com',
      password: 'emppassword123',
      role: 'employee',
      jobTitle: 'Senior Full Stack Lead',
      companyName: 'Acme Corporation',
      department: 'Engineering',
      employeeId: 'NOV-101',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });
    await empUser.save();

    // 6. Employee Profile
    const empRecord = new Employee({
      userId: empUser._id,
      name: 'David Chen',
      email: 'david.c@acme.com',
      employeeId: 'NOV-101',
      department: 'Engineering',
      designation: 'Senior Full Stack Lead',
      salary: { basic: 75000, hra: 30000, allowances: 20000, pfDeduction: 9000, taxDeduction: 7500 },
      avatar: empUser.avatar
    });
    await empRecord.save();

    // 7. Attendance Record
    const attendance = new Attendance({
      employeeName: 'David Chen',
      employeeId: 'NOV-101',
      date: new Date().toISOString().split('T')[0],
      clockIn: '09:00 AM',
      status: 'Present',
      location: 'Headquarters - Geo Verified (IP: 192.168.1.45)'
    });
    await attendance.save();

    // 8. Leave Record
    const leave = new Leave({
      employeeName: 'David Chen',
      employeeId: 'NOV-101',
      leaveType: 'Casual Leave',
      startDate: '2026-08-15',
      endDate: '2026-08-17',
      days: 3,
      reason: 'Family occasion & wellness break',
      status: 'Pending'
    });
    await leave.save();

    // 9. ATS Candidate
    const candidate = new Candidate({
      name: 'Elena Rostova',
      role: 'Staff UX Architect',
      stage: 'Interview',
      matchScore: 96,
      email: 'elena.r@acme.com'
    });
    await candidate.save();

    // 10. Kudos Record
    const kudos = new Kudos({
      senderName: 'Sarah Jenkins',
      receiverName: 'David Chen',
      badge: 'System Architect Excellence 🚀',
      message: 'Outstanding leadership on building the multi-tenant architecture and glassmorphism design!'
    });
    await kudos.save();

    // 11. Ticket Record
    const ticket = new Ticket({
      ticketId: 'TCK-201',
      title: 'MacBook Pro M3 Max screen flicker',
      description: 'Display blinks when connecting external 4K monitor.',
      category: 'IT Support',
      priority: 'High',
      employeeName: 'David Chen',
      status: 'In Progress'
    });
    await ticket.save();

    // 12. Expense Record
    const expense = new Expense({
      employeeName: 'David Chen',
      employeeId: 'NOV-101',
      title: 'Client Lunch & Travel Allowance',
      amount: 450,
      category: 'Travel & Meals',
      date: '2026-08-05',
      status: 'Pending'
    });
    await expense.save();

    // 13. Shift Record
    const shift = new Shift({
      employeeName: 'David Chen',
      employeeId: 'NOV-101',
      shiftType: 'Morning (09:00 - 17:00)',
      date: new Date().toISOString().split('T')[0],
      location: 'Headquarters',
      status: 'Scheduled'
    });
    await shift.save();

    // 14. Announcement Record
    const announcement = new Announcement({
      title: 'Q3 Enterprise All-Hands & Town Hall Meeting',
      message: 'Join us live this Friday at 3 PM EST for product roadmap updates and team recognition awards.',
      priority: 'Important',
      author: 'Company HR'
    });
    await announcement.save();

    // 15. Document Record
    const document = new Document({
      employeeName: 'David Chen',
      employeeId: 'NOV-101',
      docName: 'Executive Employment & NDA Contract 2026',
      docType: 'NDA Contract',
      status: 'Verified'
    });
    await document.save();

    console.log('✅ Reset complete! 1 sample record seeded for all platform features.');
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  }
}
