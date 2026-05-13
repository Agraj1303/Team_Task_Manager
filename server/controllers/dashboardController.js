const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // Find projects where user is admin or member
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }]
    });

    const projectIds = projects.map(p => p._id);

    // Get all tasks for these projects
    const tasks = await Task.find({ project: { $in: projectIds } });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const pendingTasks = totalTasks - completedTasks;
    
    const now = new Date();
    const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'Done').length;

    // Tasks by status
    const tasksByStatus = {
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Done': completedTasks
    };

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      tasksByStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
