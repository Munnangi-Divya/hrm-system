
const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: data.userId, orgId: data.orgId, role: data.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
