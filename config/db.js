const { Client } = require('pg');

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: 5432,
  host: process.env.PGHOST,
  ssl: true
};

module.exports = {
  Client: Client,
  config: config
};
