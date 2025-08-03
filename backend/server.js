import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js'; // ✅ Import user routes
import authRoutes from './routes/auth.js';
import companyRoutes from './routes/companies.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes); // ✅ Add user routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
