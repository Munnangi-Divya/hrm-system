


const { run, get } = require('../query');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const addLog = require('./logHelper');
require('dotenv').config();

async function register(req, res) {
  const { orgName, name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const org = await run('INSERT INTO organisations (name) VALUES (?)', [orgName]);
  const user = await run(
    'INSERT INTO users (organisation_id, email, password_hash, name, role) VALUES (?,?,?,?,?)',
    [org.id, email, hash, name, 'admin']
  );

  await addLog(org.id, user.id, 'organisation_registered', { orgName });

  const token = jwt.sign(
    { userId: user.id, orgId: org.id, role: 'admin' },
    process.env.JWT_SECRET
  );

  res.json({ token });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await get('SELECT * FROM users WHERE email=?', [email]);
  if (!user) return res.status(401).json({ message: 'Invalid' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid' });

  await addLog(user.organisation_id, user.id, 'login', { email });

  const token = jwt.sign(
    { userId: user.id, orgId: user.organisation_id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token });
}

module.exports = { register, login };

