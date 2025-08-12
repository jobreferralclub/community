import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import companyRoutes from './routes/companies.js';
import otpRoutes from './routes/otp.js';

// Initialize environment variables *before* anything else
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);        // Auth/login/signup routes
app.use('/api/auth', otpRoutes);         // OTP verification routes (send-otp, verify-otp)
app.use('/api/companies', companyRoutes); // Company routes

// (Optional) Add health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
