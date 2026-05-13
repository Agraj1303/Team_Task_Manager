const express = require('express');
const router = express.Router();
const { getGlobalAnalytics, generateReport, getUsers, getAllTasks, createUser, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/analytics', protect, admin, getGlobalAnalytics);
router.get('/report', protect, admin, generateReport);
router.get('/users', protect, admin, getUsers);
router.post('/users', protect, admin, createUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/tasks', protect, admin, getAllTasks);

module.exports = router;
