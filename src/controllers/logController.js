const { all } = require('../query');
async function list(req, res) {
  const o = req.user.orgId;
  const rows = await all('SELECT * FROM logs WHERE organisation_id=? ORDER BY id DESC', [o]);
  res.json(rows);
}
module.exports = { list };
