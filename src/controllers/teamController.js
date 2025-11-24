
const { all, get, run } = require('../query');
const addLog = require('./logHelper');

async function list(req, res) {
  const { search = '', limit = 10, page = 1 } = req.query;
  const o = req.user.orgId;
  const off = (page - 1) * limit;
  const rows = await all(
    `SELECT * FROM teams WHERE organisation_id=$1 AND name ILIKE $2 ORDER BY id DESC LIMIT $3 OFFSET $4`,
    [o, `%${search}%`, limit, off]
  );
  const totalRes = await get(`SELECT COUNT(*) as t FROM teams WHERE organisation_id=$1 AND name ILIKE $2`, [o, `%${search}%`]);
  const total = parseInt(totalRes.t || 0, 10);
  res.json({ data: rows, pagination: { total, page: Number(page), limit: Number(limit) } });
}

async function create(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const { name, description } = req.body;
  const rows = await run(
    `INSERT INTO teams (organisation_id, name, description) VALUES ($1,$2,$3) RETURNING id`,
    [o, name, description]
  );
  const id = rows[0].id;
  await addLog(o, u, 'team_created', { teamId: id, name });
  res.json({ id });
}

async function update(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const id = req.params.id;
  const { name, description } = req.body;
  await run(`UPDATE teams SET name=$1, description=$2 WHERE id=$3 AND organisation_id=$4`, [name, description, id, o]);
  await addLog(o, u, 'team_updated', { teamId: id });
  res.json({ success: true });
}

async function remove(req, res) {
  const o = req.user.orgId;
  const u = req.user.userId;
  const id = req.params.id;
  await run(`DELETE FROM teams WHERE id=$1 AND organisation_id=$2`, [id, o]);
  await addLog(o, u, 'team_deleted', { teamId: id });
  res.json({ success: true });
}

module.exports = { list, create, update, remove };
