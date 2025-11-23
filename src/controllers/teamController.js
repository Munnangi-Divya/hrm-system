
const { all, get, run } = require('../query');
const addLog = require('./logHelper');

async function list(req, res) {
  const { search = '', limit = 10, page = 1 } = req.query;
  const o = req.user.orgId;
  const off = (page - 1) * limit;
  const rows = await all(
    `SELECT * FROM teams WHERE organisation_id=? AND name LIKE ? LIMIT ? OFFSET ?`,
    [o, `%${search}%`, limit, off]
  );
  const total = await get(
    `SELECT COUNT(*) as t FROM teams WHERE organisation_id=? AND name LIKE ?`,
    [o, `%${search}%`]
  );
  res.json({ data: rows, pagination: { total: total.t, page, limit } });
}

async function create(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const { name, description } = req.body;

  const r = await run(
    `INSERT INTO teams (organisation_id, name, description) VALUES (?,?,?)`,
    [o, name, description]
  );

  await addLog(o, u, 'team_created', { teamId: r.id, name });

  res.json({ id: r.id });
}

async function update(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const id = req.params.id;
  const { name, description } = req.body;

  await run(
    `UPDATE teams SET name=?, description=? WHERE id=?`,
    [name, description, id]
  );

  await addLog(o, u, 'team_updated', { teamId: id });

  res.json({ success: true });
}

async function remove(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const id = req.params.id;

  await run(`DELETE FROM teams WHERE id=?`, [id]);
  await addLog(o, u, 'team_deleted', { teamId: id });

  res.json({ success: true });
}

module.exports = { list, create, update, remove };
