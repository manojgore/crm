const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/editinvoice", (req, res) => {
    const { invoice_number, invoice_ownerid, buyer_name, taxable_value, final_amount, gst_rate, igst, cgst, sgst_utgst, products } = req.body;

    // Updating hte Invoice
    pool.query("UPDATE invoices SET buyer_name = ?, products = ?, taxable_value = ?, final_amount = ?, gst_rate = ?, igst = ?, cgst = ?, sgst_utgst = ? WHERE invoice_number = ? AND invoice_ownerid = ?", [buyer_name, JSON.stringify(products), taxable_value, final_amount, gst_rate, igst, cgst, sgst_utgst, invoice_number, invoice_ownerid], (error, result) => {
        if (error) {
            console.error("Error checking for duplicate invoice:", error);
            return res.status(200).json({ error: error, success: false });
        }
        res.status(200).json({ result: result, msg: 'Invoice edited successfully', success: true });
    })
    
});

module.exports = router;
