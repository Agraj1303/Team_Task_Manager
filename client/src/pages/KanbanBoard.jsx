import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import CreateTaskModal from '../components/CreateTaskModal';

const KanbanBoard = ({ isAdmin }) => {
  const { id: projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, projRes] = await Promise.all([
          api.get(`/tasks?projectId=${projectId}`),
          api.get(`/projects`)
        ]);
        setTasks(taskRes.data);
        const currentProject = projRes.data.find(p => p._id === projectId);
        setProject(currentProject);
      } catch (error) {
        toast.error('Failed to load board data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });

    socket.emit('join_project', projectId);

    socket.on('task_created', (newTask) => setTasks(prev => [...prev, newTask]));
    socket.on('task_updated', (updatedTask) => setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t)));
    socket.on('task_deleted', (taskId) => setTasks(prev => prev.filter(t => t._id !== taskId)));

    return () => {
      socket.emit('leave_project', projectId);
      socket.disconnect();
    };
  }, [projectId]);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('taskId', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    if (!draggedTask || draggedTask.status === status) {
      setDraggedTask(null);
      return;
    }
    
    const originalStatus = draggedTask.status;
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
    setDraggedTask(null);

    try {
      await api.put(`/tasks/${taskId}`, { status });
    } catch (error) {
      toast.error('Failed to update task');
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: originalStatus } : t));
    }
  };

  const handleCreateTask = () => {
    if (!isAdmin) return;
    setIsModalOpen(true);
  };

  const columns = [
    { id: 'To Do', title: 'To Do', color: 'border-slate-200 dark:border-slate-700' },
    { id: 'In Progress', title: 'In Progress', color: 'border-indigo-500 dark:border-indigo-400' },
    { id: 'Done', title: 'Done', color: 'border-emerald-500 dark:border-emerald-400' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{project?.name || 'Kanban Board'}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Drag and drop tasks to update their status.</p>
        </div>
        {isAdmin && (
          <button onClick={handleCreateTask} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-colors">
            <Plus size={20} /> New Task
          </button>
        )}
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {}} 
        projectId={projectId}
        projectMembers={project?.members || []}
      />

      <div className="flex gap-6 h-full overflow-x-auto pb-6 -mx-4 px-4 lg:mx-0 lg:px-0 scroll-smooth">
        {columns.map(column => (
          <div 
            key={column.id} 
            className="flex flex-col flex-shrink-0 w-[320px] bg-slate-100/50 dark:bg-slate-800/30 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-700/50"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={`p-5 border-t-4 ${column.color} bg-white/50 dark:bg-slate-800/50 backdrop-blur-md`}>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  {column.title}
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs py-0.5 px-2.5 rounded-full font-bold">
                    {tasks.filter(t => t.status === column.id).length}
                  </span>
                </h2>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[200px]">
              <AnimatePresence>
                {tasks.filter(t => t.status === column.id).map(task => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="group bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md cursor-grab active:cursor-grabbing transition-all relative"
                  >
                    <div className="flex justify-between items-start mb-3">
                       <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                          task.priority === 'High' || task.priority === 'Urgent' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                          task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                          'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                        }`}>
                          {task.priority || 'Low'}
                        </span>
                        <div className="flex items-center gap-2">
                          <select 
                            value={task.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              if (newStatus !== task.status) {
                                api.put(`/tasks/${task._id}`, { status: newStatus })
                                  .catch(() => toast.error('Failed to update status'));
                              }
                            }}
                            className="text-[10px] font-bold bg-slate-50 dark:bg-slate-700 border-none rounded-md px-2 py-1 outline-none cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-colors"
                          >
                            {columns.map(col => (
                              <option key={col.id} value={col.id}>{col.title}</option>
                            ))}
                          </select>
                          {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done' && (
                             <AlertCircle size={16} className="text-red-500" />
                          )}
                        </div>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 leading-snug">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed font-medium">{task.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center text-xs font-bold text-slate-400 dark:text-slate-500">
                         <Calendar size={14} className="mr-1.5" />
                         {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No Date'}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {task.assignedTo && (
                          <div className="relative">
                            <img 
                              src={task.assignedTo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo.name)}&background=random`} 
                              alt="avatar" 
                              className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" 
                              title={task.assignedTo.name} 
                            />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                          </div>
                        )}
                        {isAdmin && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task._id);
                            }}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
