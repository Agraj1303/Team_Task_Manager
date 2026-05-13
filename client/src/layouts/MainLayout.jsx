import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const MainLayout = () => {
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
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`absolute z-20 flex flex-col w-64 h-full px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary dark:text-indigo-400">TaskFlow</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200' : ''}`}
                >
                  <Icon size={20} />
                  <span className="mx-4 font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6">
            <div className="flex items-center justify-between px-4 py-2 mt-2 text-gray-600 rounded-lg dark:text-gray-400">
              <div className="flex items-center gap-x-2">
                <img className="object-cover w-8 h-8 rounded-full" src={user?.avatar} alt="avatar" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate w-24">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b dark:bg-gray-900 dark:border-gray-700 md:justify-end">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none md:hidden">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center">
            <button onClick={toggleDarkMode} className="text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
