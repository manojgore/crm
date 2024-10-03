const express = require('express');
const router = express.Router();
const pool = require('../db');

router.delete("/deleteitem", (req, res) => {
    const { ownerid, product_code } = req.headers;
    
    // Deleting the Item
    pool.query("DELETE FROM items WHERE owner_id = ? AND product_code = ?", [ownerid, product_code], (error, result)=>{
        if(error){
            console.error("Error checking for duplicate user:", error);
            return res.status(200).json({ error, success: false });
        }

        res.status(200).json({ result, msg: 'Item deleted successfully', success: true });
    })
});

module.exports = router;
