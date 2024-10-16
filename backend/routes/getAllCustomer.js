const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getallcustomers', async(req, res)=>{
    const { id } = req.headers;
   try {
        pool.query("SELECT * FROM customers", (err, results) => {
            if (err) {
                console.error("Error checking for duplicate invoice owner id:", err);
                return res.status(500).json({ error: err });
            }
            
            if (results && results.length > 0) {
                if(id != undefined) {
                    return res.status(200).json({ success:true , results: results.filter((cust)=>{return cust.owner_id == id}) });
                }
                return res.status(200).json({ success:true , results: results });
            } else {
                return res.status(200).json({ success: false, msg: "no customers where found" });
            }
        });
   } catch (error) {
        console.log("Some error occured while fetching from database");
   } 
});

module.exports = router;