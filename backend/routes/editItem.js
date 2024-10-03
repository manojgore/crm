const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/edititem", (req, res) => {
    const { ownerid, product_code, name, price, hsn_sac, item_in_stock, uqc, duration } = req.body;

    // Updating hte Item
    pool.query("UPDATE items SET name = ?, price = ?, hsn_sac = ?, item_in_stock = ?, uqc = ?, duration = ? WHERE owner_id = ? AND product_code = ?", [name, price, hsn_sac, item_in_stock, uqc, duration, ownerid, product_code], (error, result) => {
        if (error) {
            console.error("Error checking for duplicate Item:", error);
            return res.status(200).json({ error: error, success: false });
        }
        res.status(200).json({ result: result, msg: 'Item edited successfully', success: true });
    })
    
});

module.exports = router;
