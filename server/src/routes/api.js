import express from 'express';
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
import { seedDatabase } from '../utils/seeder.js';

const router = express.Router();

// --- EXPENSE CLAIMS & REIMBURSEMENTS ---
router.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/expenses', async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/expenses/:id/status', async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- SHIFT SCHEDULING & ROSTER PLANNER ---
router.get('/shifts', async (req, res) => {
  try {
    const shifts = await Shift.find().sort({ createdAt: -1 });
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/shifts', async (req, res) => {
  try {
    const newShift = new Shift(req.body);
    const saved = await newShift.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- ANNOUNCEMENTS BROADCAST ---
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find({ active: true }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    const newAnn = new Announcement(req.body);
    const saved = await newAnn.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- DOCUMENT VAULT ---
router.get('/documents', async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/documents', async (req, res) => {
  try {
    const newDoc = new Document(req.body);
    const saved = await newDoc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- PREVIOUS API ROUTES ---

// 1. Data Reset Endpoint
router.post('/reset', async (req, res) => {
  try {
    await seedDatabase(true);
    res.json({ message: 'Database reset clean successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. HR Management
router.post('/company/hrs', async (req, res) => {
  try {
    const { name, email, password, jobTitle } = req.body;
    const newHr = new User({
      name,
      email,
      password: password || 'hrpassword123',
      role: 'hr',
      jobTitle: jobTitle || 'HR Manager',
      companyName: 'Acme Corporation',
      department: 'Human Resources'
    });
    await newHr.save();
    res.status(201).json(newHr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Employee CRUD
router.get('/employees', async (req, res) => {
  try {
    const emps = await Employee.find();
    res.json(emps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/company/employees', async (req, res) => {
  try {
    const { name, email, department, designation, basicSalary } = req.body;
    const empId = `NOV-${Math.floor(100 + Math.random() * 900)}`;
    const newEmp = new Employee({
      name,
      email,
      department: department || 'Engineering',
      designation: designation || 'Software Engineer',
      employeeId: empId,
      salary: {
        basic: Number(basicSalary) || 60000,
        hra: (Number(basicSalary) || 60000) * 0.4,
        allowances: 15000,
        pfDeduction: 7200,
        taxDeduction: 5000
      }
    });
    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/employees/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. IT Helpdesk Tickets
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/tickets', async (req, res) => {
  try {
    const count = await Ticket.countDocuments();
    const newTicket = new Ticket({
      ticketId: `TCK-${300 + count}`,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'IT Support',
      priority: req.body.priority || 'Medium',
      employeeName: req.body.employeeName || 'David Chen',
      status: 'Open'
    });
    const saved = await newTicket.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/tickets/:id/status', async (req, res) => {
  try {
    const updated = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. Attendance & Clock-In
router.post('/attendance/clockin', async (req, res) => {
  try {
    const newLog = new Attendance({
      employeeName: req.body.employeeName || 'David Chen',
      employeeId: req.body.employeeId || 'NOV-101',
      date: new Date().toISOString().split('T')[0],
      clockIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Present',
      location: 'Headquarters - Geo Verified (IP: 192.168.1.45)'
    });
    const saved = await newLog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 6. Leaves
router.get('/leaves', async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/leaves', async (req, res) => {
  try {
    const newLeave = new Leave(req.body);
    const saved = await newLeave.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/leaves/:id/status', async (req, res) => {
  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedLeave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 7. Super Admin Companies
router.get('/company', async (req, res) => {
  try {
    const comps = await Company.find();
    res.json(comps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/superadmin/companies', async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    const saved = await newCompany.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
