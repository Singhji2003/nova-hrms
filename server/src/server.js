import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { seedDatabase } from './utils/seeder.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nova_hrms';

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Serve client dist static files in production
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  }
});

// MongoDB Connection with automatic seeding
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('⚡ Connected to MongoDB Atlas/Database successfully!');
    await seedDatabase();
  })
  .catch((err) => {
    console.warn('⚠️ Could not connect to MongoDB instance directly:', err.message);
    console.log('💡 Note: Set your MONGODB_URI environment variable on Render.');
  });

app.listen(PORT, () => {
  console.log(`🚀 Nova HRMS Express Server running on port ${PORT}`);
});
