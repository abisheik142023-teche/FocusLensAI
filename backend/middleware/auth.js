const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

module.exports = async (req, res, next) => {
  const auth = req.header('Authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Employee.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid token (no user)' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
