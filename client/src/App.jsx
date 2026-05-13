import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import MemberLayout from './layouts/MemberLayout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminReports from './pages/admin/AdminReports';
import AdminTasks from './pages/admin/AdminTasks';
import AdminUsers from './pages/admin/AdminUsers';
import KanbanBoard from './pages/KanbanBoard'; // Reused

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard';
import MemberProjects from './pages/member/MemberProjects';
import MemberTasks from './pages/member/MemberTasks';
import MemberReports from './pages/member/MemberReports';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect based on their role
    return <Navigate to={user?.role === 'Admin' ? '/admin/dashboard' : '/member/dashboard'} replace />;
  }

  return children;
};

const RootRedirect = () => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === 'Admin' ? '/admin/dashboard' : '/member/dashboard'} replace />;
}

function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<RootRedirect />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/:id/board" element={<KanbanBoard isAdmin={true} />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Member Routes */}
        <Route path="/member" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <MemberLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="projects" element={<MemberProjects />} />
          <Route path="projects/:id/board" element={<KanbanBoard isAdmin={false} />} />
          <Route path="tasks" element={<MemberTasks />} />
          <Route path="reports" element={<MemberReports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
