import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { seedDatabase } from './utils/seeder.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nova_hrms';

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// MongoDB Connection with automatic seeding
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('⚡ Connected to MongoDB Atlas/Database successfully!');
    await seedDatabase();
  })
  .catch((err) => {
    console.warn('⚠️ Could not connect to MongoDB instance directly:', err.message);
    console.log('💡 Note: Set your MongoDB Atlas URI in server/.env file. API endpoints are ready.');
  });

app.listen(PORT, () => {
  console.log(`🚀 Nova HRMS Express Server running on port ${PORT}`);
});
