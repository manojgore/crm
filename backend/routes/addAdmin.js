const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/admin', (req, res) => {
    const { email, password } = req.body;
    pool.query('SELECT * FROM customer_registration WHERE email = ? AND password = ?', [email, password], (err, result) => {
        if (err) {
            return res.json({ "error": err });
        } else {
            if (result.length > 0) {
                // Login successful
                return res.json({ "result": result, "login": "Logged in" ,role: result[0].role, id: result[0].id});
            } else {
                // Login failed
                return res.json({result:result, "error": "Invalid username or password", "login": "Failed" });
            }
        }
    });
});

module.exports = router;
