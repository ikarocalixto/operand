const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'clientes',
  password: '102030',
  port: 5432,
});

module.exports = pool;
