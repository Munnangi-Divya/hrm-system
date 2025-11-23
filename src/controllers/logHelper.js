const { run } = require('../query');

async function addLog(orgId, userId, action, meta) {
  await run(
    `INSERT INTO logs (organisation_id, user_id, action, meta)
     VALUES (?,?,?,?)`,
    [orgId, userId, action, JSON.stringify(meta)]
  );
}

module.exports = addLog;
