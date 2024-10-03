const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getallcompanies', async(req, res)=>{
   try {
        pool.query("SELECT * FROM company_settings", (err, results) => {
            if (err) {
                console.error("Error to fetch all companies", err);
                return res.status(500).json({ error: err, success: false }); 
            }
            
            if (results && results.length > 0) {
                return res.status(200).json({ success:true , results: results});
            } else {
                return res.status(200).json({ success: false, msg: "no companies where found" });   
            }
        });
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;