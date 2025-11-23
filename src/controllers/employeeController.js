
const { all, get, run } = require('../query');
const addLog = require('./logHelper');

async function list(req, res) {
  const { search = '', limit = 10, page = 1 } = req.query;
  const o = req.user.orgId;
  const off = (page - 1) * limit;
  const rows = await all(
    `SELECT * FROM employees
     WHERE organisation_id=? AND first_name LIKE ?
     LIMIT ? OFFSET ?`,
    [o, `%${search}%`, limit, off]
  );
  const total = await get(
    `SELECT COUNT(*) as t FROM employees WHERE organisation_id=? AND first_name LIKE ?`,
    [o, `%${search}%`]
  );
  res.json({ data: rows, pagination: { total: total.t, page, limit } });
}

async function create(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const { first_name, last_name, email, phone, position } = req.body;

  const r = await run(
    `INSERT INTO employees (organisation_id, first_name, last_name, email, phone, position)
     VALUES (?,?,?,?,?,?)`,
    [o, first_name, last_name, email, phone, position]
  );

  await addLog(o, u, 'employee_created', { employeeId: r.id, first_name });

  res.json({ id: r.id });
}

async function update(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const id = req.params.id;
  const { first_name, last_name, email, phone, position } = req.body;

  await run(
    `UPDATE employees SET first_name=?, last_name=?, email=?, phone=?, position=? WHERE id=?`,
    [first_name, last_name, email, phone, position, id]
  );

  await addLog(o, u, 'employee_updated', { employeeId: id });

  res.json({ success: true });
}

async function remove(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const id = req.params.id;

  await run(`DELETE FROM employees WHERE id=?`, [id]);
  await addLog(o, u, 'employee_deleted', { employeeId: id });

  res.json({ success: true });
}

module.exports = { list, create, update, remove };
