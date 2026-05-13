const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get global analytics for Admin
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getGlobalAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const tasks = await Task.find();
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const pendingTasks = totalTasks - completedTasks;
    
    const now = new Date();
    const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'Done').length;

    const users = await User.find().select('name');
    const tasksPerUser = users.map(u => ({
      name: u.name,
      tasks: tasks.filter(t => t.assignedTo && t.assignedTo.toString() === u._id.toString()).length
    })).filter(u => u.tasks > 0);

    res.json({
      totalUsers,
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      tasksPerUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate workspace report
// @route   GET /api/admin/report
// @access  Private/Admin
const generateReport = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const projects = await Project.find().populate('admin', 'name email').populate('members', 'name email');
    const tasks = await Task.find().populate('assignedTo', 'name').populate('project', 'name');

    const report = {
      generatedAt: new Date(),
      generatedBy: req.user.name,
      summary: {
        totalUsers: users.length,
        totalProjects: projects.length,
        totalTasks: tasks.length,
      },
      projectsData: projects.map(p => {
        const projectTasks = tasks.filter(t => t.project && t.project._id.toString() === p._id.toString());
        return {
          id: p._id,
          name: p.name,
          status: p.status,
          admin: p.admin ? p.admin.name : 'Unknown',
          memberCount: p.members.length,
          taskCount: projectTasks.length,
          completedTasks: projectTasks.filter(t => t.status === 'Done').length
        };
      })
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'Admin') return res.status(400).json({ message: 'Cannot delete an Admin' });

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGlobalAnalytics,
  generateReport,
  getUsers,
  getAllTasks,
  createUser,
  deleteUser
};
