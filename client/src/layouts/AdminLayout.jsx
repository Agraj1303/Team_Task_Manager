import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, FileText, LogOut, Moon, Sun, Menu, X, ShieldAlert, CheckSquare, Users } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0B1120] font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 flex flex-col w-72 h-full bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 dark:bg-slate-900/80 dark:border-slate-800/60 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl md:shadow-none`}>
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 tracking-tight">TaskFlow</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 mb-4">
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Admin Panel</div>
        </div>

        <nav className="flex flex-col gap-1.5 px-4 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm shadow-indigo-100 dark:shadow-none' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 font-medium'}`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 m-4 mt-auto rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <img 
              className="object-cover w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`} 
              alt="avatar" 
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl dark:text-red-400 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-all duration-200">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden relative">
        <header className="flex items-center justify-between px-6 lg:px-10 py-5 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/60 dark:bg-[#0B1120]/80 dark:border-slate-800/60 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 rounded-xl dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-all duration-200 md:hidden">
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">Admin Workspace</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2.5 text-slate-500 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 rounded-xl dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105 active:scale-95">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
