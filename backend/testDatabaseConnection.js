const mysql = require('mysql');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'taxrx'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Attempt to connect to the database
pool.getConnection((error, connection) => {
    if (error) {
        console.error('Error connecting to the database:', error);
    } else {
        console.log('Connected to the database!');
       
    }
});

// Close the connection pool after 5 seconds (for testing purposes)
setTimeout(() => {
    pool.end((error) => {
        if (error) {
            console.error('Error closing the connection pool:', error);
        } else {
            console.log('Connection pool closed.');
        }
    });
}, 5000); // Adjust the timeout as needed
