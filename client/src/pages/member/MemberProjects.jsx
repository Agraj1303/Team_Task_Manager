import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FolderKanban, Users, ArrowRight } from 'lucide-react';

const MemberProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
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
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Projects</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Projects you have been assigned to.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <FolderKanban size={100} className="text-emerald-600 dark:text-emerald-400 translate-x-4 -translate-y-4" />
            </div>

            <div className="relative z-10">
               <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    project.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                    project.status === 'Completed' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400'
                  }`}>
                    {project.status}
                  </span>
               </div>

               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{project.name}</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 h-10">{project.description || 'No description provided.'}</p>

               <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex -space-x-3">
                     {project.members.slice(0, 3).map((member) => (
                       <img key={member._id} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800" src={member.avatar} alt={member.name} title={member.name} />
                     ))}
                     {project.members.length > 3 && (
                       <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                         +{project.members.length - 3}
                       </div>
                     )}
                     {project.members.length === 0 && (
                        <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-dashed dark:border-slate-700 flex items-center justify-center text-slate-400">
                           <Users size={16} />
                        </div>
                     )}
                  </div>
                  
                  <Link 
                    to={`/member/projects/${project._id}/board`}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white transition-colors"
                  >
                    <ArrowRight size={20} />
                  </Link>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20">
          <FolderKanban className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No assigned projects</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">You will see projects here once your Admin adds you to a team.</p>
        </div>
      )}
    </div>
  );
};

export default MemberProjects;
