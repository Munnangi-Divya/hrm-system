const { all } = require('../query');

async function list(req, res) {
  const o = req.user.orgId;
  const rows = await all('SELECT id, action, meta, created_at FROM logs WHERE organisation_id=$1 ORDER BY id DESC LIMIT 200', [o]);
  res.json(rows);
}

module.exports = { list };
