const jwt = require('jsonwebtoken');
const db = require('../config/database');

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;

    // Check if user is admin
    const [users] = await db.query('SELECT role FROM users WHERE id = ?', [decoded.userId]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (users[0].role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = adminAuthMiddleware;
