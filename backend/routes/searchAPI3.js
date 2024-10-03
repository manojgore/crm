const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/search1/:payment_status', (req, res) => {
    let { payment_status } = req.params;

    let sql = "SELECT * FROM invoice_details";
    let params = [];

    // if (Party_Name) {
    //     console.log("line 12 in searchAPI 1",Party_Name)
    //     sql += " WHERE Party_Name LIKE ?";
    //     params.push(`%${Party_Name}%`);
    // }

    // if (start_date && end_date) {
    //     sql += " WHERE Invoice_Date >= ? AND Invoice_Date <= ?";
    //     // else
    //     // sql+=" Invoice_Date >= ? AND Invoice_Date <= ?"
    //     params.push(start_date, end_date);
    // }

    if (payment_status) {
        console.log("Line no 25 ",req.params)
            sql += " WHERE payment_status = ?";
            params.push(payment_status);
    }

    pool.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ results: results });
    });
});

module.exports = router;
