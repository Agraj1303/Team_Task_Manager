import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckSquare, Calendar, Folder } from 'lucide-react';
import { format } from 'date-fns';

const MemberTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, currentStatus) => {
    const statuses = ['To Do', 'In Progress', 'Done'];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
    
    try {
      await api.put(`/tasks/${taskId}`, { status: nextStatus });
      toast.success(`Moved to ${nextStatus}`);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Tasks</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Focus on what matters today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            whileHover={{ y: -2 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <button 
                onClick={() => handleStatusUpdate(task._id, task.status)}
                className={`p-3 rounded-2xl transition-all ${
                  task.status === 'Done' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-700/50 hover:bg-indigo-100 hover:text-indigo-600'
                }`}
              >
                <CheckSquare size={24} />
              </button>
              <div>
                <h3 className={`font-bold text-lg ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                <div className="flex flex-wrap gap-4 mt-1 text-sm font-semibold">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Folder size={14} className="text-indigo-500" />
                    {task.project?.name}
                  </div>
                  <div className={`flex items-center gap-1.5 ${new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'text-rose-500' : 'text-slate-400'}`}>
                    <Calendar size={14} />
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No date'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                task.status === 'Done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                task.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' :
                'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400'
              }`}>
                {task.status}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                task.priority === 'High' || task.priority === 'Urgent' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400'
              }`}>
                {task.priority || 'Medium'}
              </span>
            </div>
          </motion.div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
             <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">No tasks assigned to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberTasks;
