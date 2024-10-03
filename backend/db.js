const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10, // Maximum number of connections in the pool
    host: 'localhost',   // MySQL database host
    user: 'root',        // MySQL database username
    password: 'mypass123',    // MySQL database password
    database: 'taxrx'   // MySQL database name
});
pool.getConnection((error, connection) => {
    if (error) {
        console.error('Error connecting to the database:', error);
    } else {
        console.log('Connected to the database!');
    }
});
// Function to execute SQL queries

module.exports = pool;
