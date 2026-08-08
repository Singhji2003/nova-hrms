import express from 'express';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Candidate from '../models/Candidate.js';
import Kudos from '../models/Kudos.js';
import Company from '../models/Company.js';
import Course from '../models/Course.js';
import Ticket from '../models/Ticket.js';
import { seedDatabase } from '../utils/seeder.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', platform: 'Nova HRMS Multi-Tenant API v2.0', timestamp: new Date() });
});

// Reset Database Endpoint
router.post('/reset', async (req, res) => {
  try {
    await seedDatabase(true);
    res.json({ message: 'Database reset successfully! Exactly 1 clean sample record seeded per feature.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authentication Endpoint
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let query = {};
    if (email) query.email = email.toLowerCase().trim();
    else if (role) query.role = role;

    let user = await User.findOne(query);
    
    if (!user) {
      user = await User.findOne({ role: role || 'hr' }) || await User.findOne();
    }

    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    res.json({
      token: 'nova_jwt_token_' + Date.now(),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        department: user.department,
        jobTitle: user.jobTitle,
        avatar: user.avatar,
        createdBy: user.createdBy,
        employeeId: user.employeeId
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SUPER ADMIN ENDPOINTS ---

router.post('/superadmin/companies', async (req, res) => {
  try {
    const { companyName, domain, adminName, adminEmail, adminPassword, plan } = req.body;

    const existingUser = await User.findOne({ email: adminEmail.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const company = new Company({
      name: companyName,
      domain: domain || companyName.toLowerCase().replace(/\s+/g, '') + '.com',
      plan: plan || 'Growth',
      employeeCount: 1,
      monthlyBilling: plan === 'Enterprise' ? 1499 : plan === 'Growth' ? 599 : 299,
      status: 'Active',
      featuresEnabled: true
    });
    await company.save();

    const companyAdmin = new User({
      name: adminName || companyName + ' Director',
      email: adminEmail.toLowerCase().trim(),
      password: adminPassword || 'password123',
      role: 'company',
      jobTitle: 'Company Admin / Director',
      companyName: companyName,
      department: 'Executive',
      createdBy: 'Super Admin'
    });
    await companyAdmin.save();

    res.status(201).json({ message: 'Company & Company Admin Credentials created successfully!', company, companyAdmin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/superadmin/companies/:id', async (req, res) => {
  try {
    const { name, domain, plan, monthlyBilling } = req.body;
    const updated = await Company.findByIdAndUpdate(req.params.id, { name, domain, plan, monthlyBilling }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/superadmin/companies/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const featuresEnabled = status === 'Active';
    const updated = await Company.findByIdAndUpdate(req.params.id, { status, featuresEnabled }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/superadmin/companies/:id', async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company removed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/superadmin/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { password: newPassword },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'Company admin email not found' });
    res.json({ message: `Password for ${email} reset successfully!`, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- COMPANY ADMIN & HR ENDPOINTS ---

// HR CRUD
router.post('/company/hrs', async (req, res) => {
  try {
    const { name, email, password, companyName, department, jobTitle } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'HR account with this email already exists' });
    }

    const hrUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: password || 'password123',
      role: 'hr',
      jobTitle: jobTitle || 'HR Manager',
      companyName: companyName || 'Acme Corporation',
      department: department || 'Human Resources',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdBy: 'Company Admin'
    });
    await hrUser.save();

    res.status(201).json({ message: 'HR Manager credentials created successfully!', hrUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User account deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Employee CRUD
router.post('/company/employees', async (req, res) => {
  try {
    const { name, email, password, companyName, department, designation, salary, createdByRole } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Employee account with this email already exists' });
    }

    const empId = 'NOV-' + Math.floor(100 + Math.random() * 900);

    const empUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: password || 'password123',
      role: 'employee',
      jobTitle: designation || 'Software Engineer',
      companyName: companyName || 'Acme Corporation',
      department: department || 'Engineering',
      employeeId: empId,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdBy: createdByRole || 'Company Admin'
    });
    await empUser.save();

    await Company.findOneAndUpdate(
      { name: companyName || 'Acme Corporation' },
      { $inc: { employeeCount: 1 } }
    );

    const empRecord = new Employee({
      userId: empUser._id,
      name,
      email: email.toLowerCase().trim(),
      employeeId: empId,
      department: department || 'Engineering',
      designation: designation || 'Software Engineer',
      salary: salary || { basic: 60000, hra: 24000, allowances: 16000, pfDeduction: 7200, taxDeduction: 5500 },
      avatar: empUser.avatar
    });
    await empRecord.save();

    res.status(201).json({ message: 'Employee credentials & record created successfully!', empUser, empRecord });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/employees/:id', async (req, res) => {
  try {
    const { name, department, designation, salary } = req.body;
    const updated = await Employee.findByIdAndUpdate(req.params.id, { name, department, designation, salary }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (emp) {
      await User.findOneAndDelete({ email: emp.email });
    }
    res.json({ message: 'Employee removed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Users
router.get('/users', async (req, res) => {
  try {
    const { role, companyName } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (companyName) filter.companyName = companyName;

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Employees Roster
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Attendance
router.get('/attendance', async (req, res) => {
  try {
    const list = await Attendance.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/attendance/clockin', async (req, res) => {
  try {
    const { employeeName, employeeId, location } = req.body;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toISOString().split('T')[0];

    const record = new Attendance({
      employeeName: employeeName || 'David Chen',
      employeeId: employeeId || 'NOV-101',
      date: dateString,
      clockIn: timeString,
      status: 'Present',
      location: location || 'Headquarters - Geo Verified (IP: 192.168.1.45)'
    });
    await record.save();
    res.json({ message: 'Clocked in successfully!', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leaves
router.get('/leaves', async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/leaves', async (req, res) => {
  try {
    const newLeave = new Leave(req.body);
    await newLeave.save();
    res.status(201).json(newLeave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/leaves/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Payroll run
router.post('/payroll/run', async (req, res) => {
  try {
    const employees = await Employee.find();
    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    const paySlips = employees.map(emp => {
      const gross = emp.salary.basic + emp.salary.hra + emp.salary.allowances;
      const deductions = emp.salary.pfDeduction + emp.salary.taxDeduction;
      const net = gross - deductions;

      totalGross += gross;
      totalDeductions += deductions;
      totalNet += net;

      return {
        employeeId: emp.employeeId,
        name: emp.name,
        designation: emp.designation,
        basic: emp.salary.basic,
        hra: emp.salary.hra,
        allowances: emp.salary.allowances,
        deductions,
        netPay: net
      };
    });

    res.json({
      month: 'August 2026',
      totalEmployees: employees.length,
      totalGross,
      totalDeductions,
      totalNet,
      paySlips,
      status: 'Batch Processed Successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ATS Candidates
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kudos Feed
router.get('/kudos', async (req, res) => {
  try {
    const kudos = await Kudos.find().sort({ createdAt: -1 });
    res.json(kudos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/kudos', async (req, res) => {
  try {
    const newKudos = new Kudos(req.body);
    await newKudos.save();
    res.status(201).json(newKudos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LMS Courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/courses', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// IT Helpdesk Tickets
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tickets', async (req, res) => {
  try {
    const { title, description, category, priority, employeeName } = req.body;
    const ticketId = 'TCK-' + Math.floor(200 + Math.random() * 800);
    const newTicket = new Ticket({
      ticketId,
      title: title || 'Hardware Support Request',
      description: description || 'Device query',
      category: category || 'IT Support',
      priority: priority || 'Medium',
      employeeName: employeeName || 'David Chen',
      status: 'Open'
    });
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/tickets/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
