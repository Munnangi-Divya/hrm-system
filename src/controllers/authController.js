

const { run, get } = require('../query');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const addLog = require('./logHelper');
require('dotenv').config();

async function register(req, res) {
  const { orgName, name, email, password } = req.body;
  if (!orgName || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const orgRows = await run('INSERT INTO organisations (name) VALUES ($1) RETURNING id', [orgName]);
  const orgId = orgRows[0].id;
  const hash = await bcrypt.hash(password, 10);
  const userRows = await run(
    'INSERT INTO users (organisation_id, email, password_hash, name, role) VALUES ($1,$2,$3,$4,$5) RETURNING id',
    [orgId, email, hash, name, 'admin']
  );
  const userId = userRows[0].id;
  await addLog(orgId, userId, 'organisation_registered', { orgName });
  const token = jwt.sign({ userId, orgId, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  res.json({ token });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  const user = await get('SELECT * FROM users WHERE email=$1', [email]);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  await addLog(user.organisation_id, user.id, 'login', { email });
  const token = jwt.sign({ userId: user.id, orgId: user.organisation_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  res.json({ token });
}

module.exports = { register, login };
