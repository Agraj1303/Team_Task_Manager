import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { FileDown, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MemberReports = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get('/tasks/report');
        setReportData(data);
      } catch (error) {
        toast.error('Failed to load report data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleExportCSV = () => {
    if (!reportData) return;
    const headers = ['Project Name', 'Total Tasks', 'Completed Tasks', 'Progress %'];
    const csvContent = [
      headers.join(','),
      ...reportData.projectsData.map(p => [
        `"${p.name}"`,
        p.taskCount,
        p.completedTasks,
        `${Math.round((p.completedTasks / p.taskCount) * 100)}%`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `taskflow_member_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Personal Report</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Your individual performance and task summary.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-colors"
        >
          <FileDown size={18} />
          Export to CSV
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/50 print:p-0 print:shadow-none print:border-none print:bg-transparent"
      >
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200 dark:border-slate-700 print:border-slate-300">
           <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white print:text-black flex items-center gap-2">
                 TaskFlow <span className="text-emerald-600 dark:text-emerald-400 print:text-emerald-600">Member Report</span>
              </h2>
              <p className="text-slate-500 print:text-slate-600 mt-1">Activity summary for {reportData?.generatedBy}</p>
           </div>
           <div className="text-right">
              <div className="flex items-center gap-2 text-slate-500 print:text-slate-600 justify-end">
                <Calendar size={16} />
                <span className="font-medium">{format(new Date(reportData?.generatedAt), 'MMMM d, yyyy')}</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-2">
              <CheckCircle2 size={18} />
              <span className="font-bold uppercase tracking-wider text-[10px]">Total Tasks</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{reportData?.summary.totalTasks}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle2 size={18} />
              <span className="font-bold uppercase tracking-wider text-[10px]">Completed</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{reportData?.summary.completedTasks}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-2">
              <Clock size={18} />
              <span className="font-bold uppercase tracking-wider text-[10px]">Pending</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{reportData?.summary.pendingTasks}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-2">
              <AlertCircle size={18} />
              <span className="font-bold uppercase tracking-wider text-[10px]">Overdue</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{reportData?.summary.overdueTasks}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white print:text-black mb-6">Work Breakdown by Project</h3>
        
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 print:bg-slate-100 border-b border-slate-200 dark:border-slate-700 print:border-slate-300">
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 print:text-slate-700">Project</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 print:text-slate-700 text-center">Your Tasks</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 print:text-slate-700 text-center">Completed</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 print:text-slate-700 text-center">Progress</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.projectsData.map((project) => (
                <tr key={project.id} className="border-b border-slate-100 dark:border-slate-700/50 print:border-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 dark:text-white print:text-black">{project.name}</td>
                  <td className="p-4 text-center font-medium text-slate-900 dark:text-white print:text-black">{project.taskCount}</td>
                  <td className="p-4 text-center font-medium text-emerald-600 dark:text-emerald-400 print:text-emerald-600">{project.completedTasks}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${(project.completedTasks / project.taskCount) * 100}%` }}
                          ></div>
                       </div>
                       <span className="text-xs font-bold text-slate-500">{Math.round((project.completedTasks / project.taskCount) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {reportData?.projectsData.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default MemberReports;
