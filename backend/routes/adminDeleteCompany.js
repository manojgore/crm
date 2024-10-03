const express = require('express');
const router = express.Router();
const pool = require('../db');

router.delete("/deleteCompany", (req, res) => {
    const { id } = req.headers;
    pool.query("DELETE FROM company_settings WHERE id = ?", [id], (error, result)=>{
        if(error){
            console.error("Error checking for duplicate user:", error);
            return res.status(500).json({ error, success: false });
        }

        pool.query("DELETE FROM customer_registration WHERE id = ?", [id], (secErr, secResult)=>{
            res.status(200).json({ result, message: 'Company deleted successfully', success: true });
        })
    })
});

module.exports = router;
