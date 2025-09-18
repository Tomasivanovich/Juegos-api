const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'hopper.proxy.rlwy.net',
    user: 'root',       
    password: 'LwxyTsHmkgDGmKNwPkkHnBaZNVRXqyRm',       
    database: 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 28290
});

module.exports = pool.promise();