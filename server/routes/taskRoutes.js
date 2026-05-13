const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getMemberReport
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/report', protect, getMemberReport);

router.route('/')
  .get(protect, getTasks)
  .post(protect, admin, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, admin, deleteTask);

module.exports = router;
