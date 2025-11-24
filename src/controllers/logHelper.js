


const { run } = require('../query');

async function addLog(orgId, userId, action, meta) {
  await run(
    `INSERT INTO logs (organisation_id, user_id, action, meta) VALUES ($1,$2,$3,$4)`,
    [orgId, userId, action, JSON.stringify(meta || {})]
  );
}

module.exports = addLog;
