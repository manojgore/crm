const express = require('express');
const router = express.Router();
const pool = require('../db');

router.delete("/deletecustomer", (req, res) => {
    const { owner_id, id } = req.headers;
    // Deleting the expense
    pool.query("DELETE FROM customers WHERE owner_id = ? AND id = ?", [owner_id, id], (error, result)=>{
        if(error){
            console.error("Error checking for duplicate user:", error);
            return res.status(200).json({ error, success: false });
        }

        pool.query("DELETE FROM customer_registration WHERE id = ?", [id], (secErr, secResult)=>{
            res.status(200).json({ secResult, msg: 'Customer deleted successfully', success: true });
        })
    })
});

module.exports = router;
