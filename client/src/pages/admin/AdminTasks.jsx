import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckSquare, Calendar, Folder, Tag, User } from 'lucide-react';
import { format } from 'date-fns';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/admin/tasks');
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Global Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Every task across all projects in one place.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <th className="p-6 font-bold text-slate-600 dark:text-slate-300">Task</th>
                <th className="p-6 font-bold text-slate-600 dark:text-slate-300">Project</th>
                <th className="p-6 font-bold text-slate-600 dark:text-slate-300">Assignee</th>
                <th className="p-6 font-bold text-slate-600 dark:text-slate-300">Due Date</th>
                <th className="p-6 font-bold text-slate-600 dark:text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        task.status === 'Done' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20'
                      }`}>
                        <CheckSquare size={18} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{task.title}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                      <Folder size={16} className="text-slate-400" />
                      {task.project?.name || 'Deleted Project'}
                    </div>
                  </td>
                  <td className="p-6">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <img src={task.assignedTo.avatar} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" alt="" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{task.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 font-medium italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500 font-medium text-sm">
                      <Calendar size={16} />
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date'}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      task.status === 'Done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      task.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;
