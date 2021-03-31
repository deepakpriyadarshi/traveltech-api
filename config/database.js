const { createPool } = require('mysql');

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database:process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: process.env.DB_POOL_CONNECTION_LIMIT,
});

module.exports = pool;