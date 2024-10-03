const express = require('express');
const router = express.Router();
const pool = require('../db');

router.delete("/deleteinvoice", (req, res) => {
    const { invoice_number, invoice_ownerid } = req.headers;
    pool.query("DELETE FROM invoices WHERE invoice_number = ? AND invoice_ownerid = ?", [invoice_number, invoice_ownerid], (error, result)=>{
        if(error){
            console.error("Error checking for duplicate user:", error);
            return res.status(200).json({ error, success: false });
        }

        res.status(200).json({ result, msg: 'Invoice deleted successfully', success: true });
    })
});

module.exports = router;
