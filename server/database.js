
const knex = require('knex');
const path = require('path');

const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: path.join(__dirname, 'templatehub.sqlite'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations'),
  },
});

module.exports = db;