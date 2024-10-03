const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/search', (req, res) => {
    let { Party_Name, start_date, end_date, payment_status } = req.query;

    let sql = "SELECT * FROM invoice_details";
    let params = [];

    if (Party_Name) {
        sql += " WHERE Party_Name LIKE ?";
        params.push(`%${Party_Name}%`);
    }

    if (start_date && end_date) {
        if (Party_Name) {
            sql += " AND";
        }
        if(Party_Name==null)
        sql += " WHERE Invoice_Date >= ? AND Invoice_Date <= ?";
        else
        sql+=" Invoice_Date >= ? AND Invoice_Date <= ?"
        params.push(start_date, end_date);
    }

    if (payment_status) {
        if (Party_Name || (start_date && end_date)) {
            sql += " AND payment_status = ?";
        }
        else if(Party_Name==null && (start_date=null && end_date==null))
        {
            sql += " WHERE payment_status = ?";
        }
        
        
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
