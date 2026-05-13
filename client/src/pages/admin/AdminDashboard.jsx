import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Users, FolderKanban, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, trend, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{title}</p>
        <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl shadow-lg ${color}`}>
        <Icon size={28} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/analytics');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load global analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pieData = [
    { name: 'Completed', value: stats.completedTasks, color: '#10B981' },
    { name: 'Pending', value: stats.pendingTasks, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Global Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">High-level analytics across all workspaces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={CheckSquare} delay={0.1} color="bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/30" />
        <StatCard title="In Progress" value={stats.pendingTasks} icon={Clock} delay={0.2} color="bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30" />
        <StatCard title="Completed" value={stats.completedTasks} icon={CheckCircle2} delay={0.3} color="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30" />
        <StatCard title="Overdue" value={stats.overdueTasks} icon={AlertCircle} delay={0.4} color="bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Task Distribution</h3>
          <div className="h-72 flex items-center justify-center">
            {stats.totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1E293B', color: '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 font-medium text-lg">No task data available.</p>
            )}
          </div>
          {stats.totalTasks > 0 && (
             <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-emerald-500"></span><span className="text-sm font-bold text-slate-700 dark:text-slate-200">Done ({stats.completedTasks})</span></div>
                <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-amber-500"></span><span className="text-sm font-bold text-slate-700 dark:text-slate-200">Pending ({stats.pendingTasks})</span></div>
             </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tasks Per User</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.tasksPerUser}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1E293B', color: '#fff' }}
                />
                <Bar dataKey="tasks" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
