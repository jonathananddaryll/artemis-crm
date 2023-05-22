// const postgres = require('postgres');
// require('dotenv').config();

// const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
// const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

// const sql = postgres(URL, { ssl: 'require' });

// async function getPgVersion() {
//   const result = await sql`select version()`;
//   console.log(result);
// }

// module.exports = getPgVersion;

const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });

module.exports = sql;

// const Client = require('pg').Client;

// const pgClient = new Client({
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   database: process.env.PGDATABASE,
//   port: 5432,
//   host: process.env.PGHOST,
//   ssl: true
// });

// module.exports = {
//   client: pgClient
// };
