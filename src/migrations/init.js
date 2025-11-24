const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function init() {
  const schema = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
  await pool.query(schema);
  console.log("PostgreSQL schema initialized successfully");
}

module.exports = init;

