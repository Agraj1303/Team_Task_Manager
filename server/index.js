require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const http = require('http');
const connectDB = require('./config/db');
const setupSockets = require('./sockets');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

// Connect to database
connectDB();

// Seed Admin User
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@taskflow.com' });
    if (!adminExists) {
      await User.create({
        name: 'Master Admin',
        email: 'admin@taskflow.com',
        password: 'Admin@123',
        role: 'Admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      });
      console.log('Hardcoded Admin user seeded successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  }
};
seedAdmin();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // NEW

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(err.stack);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Setup Socket.IO
setupSockets(server);

// Static files for production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
