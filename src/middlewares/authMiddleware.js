const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ message: 'Unauthorized' });
  const token = h.split(' ')[1];
  const data = jwt.verify(token, process.env.JWT_SECRET);
  req.user = data;
  next();
};
