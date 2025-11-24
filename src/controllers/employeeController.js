
const { all, get, run } = require('../query');
const addLog = require('./logHelper');

async function list(req, res) {
  const { search = '', limit = 10, page = 1 } = req.query;
  const o = req.user.orgId;
  const off = (page - 1) * limit;
  const rows = await all(
    `SELECT * FROM employees WHERE organisation_id=$1 AND (first_name ILIKE $2 OR last_name ILIKE $2) ORDER BY id DESC LIMIT $3 OFFSET $4`,
    [o, `%${search}%`, limit, off]
  );
  const totalRes = await get(`SELECT COUNT(*) as t FROM employees WHERE organisation_id=$1 AND (first_name ILIKE $2 OR last_name ILIKE $2)`, [o, `%${search}%`]);
  const total = parseInt(totalRes.t || 0, 10);
  res.json({ data: rows, pagination: { total, page: Number(page), limit: Number(limit) } });
}

async function create(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const { first_name, last_name, email, phone, position } = req.body;
  const rows = await run(
    `INSERT INTO employees (organisation_id, first_name, last_name, email, phone, position) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [o, first_name, last_name, email, phone, position]
  );
  const id = rows[0].id;
  await addLog(o, u, 'employee_created', { employeeId: id, first_name, last_name });
  res.json({ id });
}

async function update(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const id = req.params.id;
  const { first_name, last_name, email, phone, position } = req.body;
  await run(
    `UPDATE employees SET first_name=$1, last_name=$2, email=$3, phone=$4, position=$5 WHERE id=$6 AND organisation_id=$7`,
    [first_name, last_name, email, phone, position, id, o]
  );
  await addLog(o, u, 'employee_updated', { employeeId: id });
  res.json({ success: true });
}

async function remove(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const id = req.params.id;
  await run(`DELETE FROM employees WHERE id=$1 AND organisation_id=$2`, [id, o]);
  await addLog(o, u, 'employee_deleted', { employeeId: id });
  res.json({ success: true });
}

module.exports = { list, create, update, remove };
