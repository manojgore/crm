const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get("/getaccountsettiings", (req, res) => {
    const { id } = req.headers;
    console.log("id: ", id);
    pool.query("SELECT * FROM customers WHERE owner_id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error checking for duplicate invoice number:", err);
            return res.status(500).json({ error: "Internal server error", success: false });
        }
        if (results && results.length > 0) {
            return res.status(200).json({ results: results, success: true });
        } else {
            return res.status(200).json({ error: "No such id found", success: false });
        }
    });
});

module.exports = router;
