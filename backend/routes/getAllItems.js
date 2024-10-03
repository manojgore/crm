const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getallitems', async(req, res)=>{
    const { id } = req.headers;
   try {
        pool.query("SELECT * FROM items WHERE owner_id = ?", [id], (err, results) => {
            if (err) {
                console.error("Error checking for duplicate item owner id:", err);
                return res.status(500).json({ error: err });
            }
            
            if (results && results.length > 0) {
                return res.status(200).json({ success:true , results: results });
            } else {
                return res.status(200).json({ success: false, msg: "no items where found" });   
            }
        });
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;