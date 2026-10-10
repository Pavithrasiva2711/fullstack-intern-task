
require('dotenv').config();

const knex = require('knex');
const path = require('path');

const isPostgres = Boolean(process.env.DATABASE_URL);

const db = knex({
  client: isPostgres ? 'pg' : 'better-sqlite3',

  connection: isPostgres
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        filename: path.join(__dirname, 'templatehub.sqlite'),
      },

  useNullAsDefault: true,

  migrations: {
    directory: path.join(__dirname, 'migrations'),
  },
});

module.exports = db;
