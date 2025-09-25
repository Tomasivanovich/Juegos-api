const mysql = require("mysql2");
require('dotenv').config(); // Para usar variables de entorno

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'nozomi.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'tLiFMbZunTnutPQtLApURYkbGwKewhnr',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 30511,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
