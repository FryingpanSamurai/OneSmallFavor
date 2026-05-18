const { Pool } = require("pg");

const pool = new Pool({
  user: "user",
  host: "localhost",
  database: "db",
  password: "password"
});

module.exports = pool;