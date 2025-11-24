const pool = require('./db');

async function run(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}

async function all(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}

async function get(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows[0] || null;
}

module.exports = { run, all, get };


