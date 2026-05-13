import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
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

const MemberDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) return null;

  const barData = Object.entries(stats.tasksByStatus).map(([name, count]) => ({
    name,
    count
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Track your assigned tasks and personal progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={CheckSquare} color="bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/30" />
        <StatCard title="Completed" value={stats.tasksByStatus['Done'] || 0} icon={CheckCircle2} color="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30" />
        <StatCard title="Pending" value={stats.totalTasks - (stats.tasksByStatus['Done'] || 0)} icon={Clock} color="bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30" />
        <StatCard title="Overdue" value={stats.overdueTasks} icon={AlertCircle} color="bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Task Status Breakdown</h3>
          <div className="h-72">
             {barData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barData}>
                   <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                   <RechartsTooltip 
                     cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                     contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1E293B', color: '#fff' }}
                   />
                   <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                     {barData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={
                         entry.name === 'Done' ? '#10B981' :
                         entry.name === 'In Progress' ? '#6366F1' :
                         '#94A3B8'
                       } />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-400 font-medium">No assigned tasks yet.</div>
             )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Progress</h3>
          <div className="h-72 flex items-center justify-center">
            {stats.totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={barData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="count"
                    stroke="none"
                  >
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.name === 'Done' ? '#10B981' :
                        entry.name === 'In Progress' ? '#6366F1' :
                        '#94A3B8'
                      } />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1E293B', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 font-medium">No task data available.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MemberDashboard;
