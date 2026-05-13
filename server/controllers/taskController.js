const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks for a project
// @route   GET /api/tasks?projectId=xxx
// @access  Private
const getTasks = async (req, res) => {
  const { projectId } = req.query;

  try {
    let query = {};
    if (projectId) {
      // Check if user has access to this project
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      
      if (project.admin.toString() !== req.user._id.toString() && !project.members.includes(req.user._id)) {
        return res.status(401).json({ message: 'Not authorized to view tasks for this project' });
      }
      query.project = projectId;
    } else {
      // If no project ID, just get tasks assigned to user or created by user
      query = {
        $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }]
      };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo, projectId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Only Admin can create tasks (based on prompt rules: Admin: Create/Edit/Delete tasks)
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Only admin can create tasks' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      project: projectId,
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email avatar').populate('createdBy', 'name email avatar');

    // Real-time update
    if (global.io) {
      global.io.to(projectId).emit('task_created', populatedTask);
    }

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    const isAdmin = project.admin.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    // Members can only update status and add comments
    if (!isAdmin && !isAssignee) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    // If member, restrict what they can update
    if (!isAdmin) {
      // Members can only update status
      if (req.body.title || req.body.description || req.body.dueDate || req.body.priority || req.body.assignedTo) {
        return res.status(401).json({ message: 'Members can only update task status' });
      }
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('assignedTo', 'name email avatar').populate('createdBy', 'name email avatar');

    // Real-time update
    if (global.io) {
      global.io.to(task.project.toString()).emit('task_updated', task);
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Only admin can delete tasks' });
    }

    await task.deleteOne();

    // Real-time update
    if (global.io) {
      global.io.to(task.project.toString()).emit('task_deleted', task._id);
    }

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get member report
// @route   GET /api/tasks/report
// @access  Private
const getMemberReport = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate('project', 'name');
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const pendingTasks = totalTasks - completedTasks;
    const now = new Date();
    const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'Done').length;

    const projectsData = [...new Set(tasks.map(t => t.project?._id))].map(projId => {
      const projTasks = tasks.filter(t => t.project?._id.toString() === projId?.toString());
      return {
        id: projId,
        name: projTasks[0]?.project?.name || 'Unknown Project',
        taskCount: projTasks.length,
        completedTasks: projTasks.filter(t => t.status === 'Done').length
      };
    });

    res.json({
      generatedBy: req.user.name,
      generatedAt: new Date(),
      summary: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks
      },
      projectsData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getMemberReport
};
