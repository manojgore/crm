const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/searchExpense', (req, res) => {
    let { id } = req.headers;

    try {
        pool.query("SELECT * FROM addexpense WHERE Owner_ID = ?", [id], (err, results) => {
            if (err) {
                console.error("Error checking for duplicate expense owner id:", err);
                return res.status(500).json({ error: err });
            }
            
            if (results && results.length > 0) {
                return res.status(200).json({ success:true , results: results });
            } else {
                return res.status(200).json({ success: false, msg: "no expences where found" });   
            }
        });
   } catch (error) {
        console.log("Some error occured while fetching from database");
   }
});

module.exports = router;