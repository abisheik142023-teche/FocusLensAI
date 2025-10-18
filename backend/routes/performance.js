const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Performance = require('../models/Performance');
const Employee = require('../models/Employee');

// Get personal performance (last N days)
router.get('/performance', authenticate, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const data = await Performance.find({ employeeId: req.user._id, date: { $gte: dateThreshold } }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Manager: get team performance
router.get('/team-performance', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const days = parseInt(req.query.days) || 7;
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const members = await Employee.find({ team: req.user.team });
    const performance = await Performance.find({
      employeeId: { $in: members.map(m => m._id) },
      date: { $gte: dateThreshold }
    }).populate('employeeId', 'name email');
    res.json(performance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
