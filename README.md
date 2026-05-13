# TaskFlow - Team Task Management System

TaskFlow is a high-performance, professional collaborative project management platform built with the MERN stack. It features real-time updates, advanced analytics, and a premium glassmorphic UI.

## 🚀 Live Demo
teamtaskmanager-production-ae89.up.railway.app

## 🔑 Admin Credentials
- **Email**: `admin@taskflow.com`
- **Password**: `Admin@123`

## ✨ Features
- **Admin Control**: Create/Delete projects, Manage users, Assign tasks, Global analytics.
- **Member Panel**: Personal task boards, individual performance metrics.
- **Kanban Board**: Drag-and-drop or dropdown-based task status management.
- **Reports**: Generate and export project/user performance data to **CSV**.
- **Real-Time**: Socket.IO integration for instant task updates across the team.
- **Theme**: Premium dark/light mode toggle with Framer Motion animations.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Zustand, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB Atlas, Socket.IO.
- **Deployment**: Prepared for Railway (Backend/Monorepo).

## 💻 Local Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Agraj1303/Team_Task_Manager.git
   cd team-task-manager
   ```

2. **Backend**:
   ```bash
   cd server
   npm install
   # Create .env with: PORT, MONGODB_URI, JWT_SECRET, FRONTEND_URL
   npm run dev
   ```

3. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🚢 Deployment (Railway)
This project is configured for a unified deployment on Railway:
1. Connect your GitHub repository to Railway.
2. The root `package.json` (if created) or the `server/index.js` will serve the built frontend from `client/dist`.
3. Set `NODE_ENV=production` in Railway variables.
4. Set `MONGODB_URI`, `JWT_SECRET`, and `PORT`.

## 📜 License
MIT
