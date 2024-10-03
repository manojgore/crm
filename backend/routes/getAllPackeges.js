const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getallpackages', async(req, res)=>{
   try {
        pool.query("SELECT * FROM subscription_packages", (err, results) => {
            if (err) {
                console.error("Error getting packeges from the database", err);
                return res.status(500).json({ error: err });
            }
            
            if (results && results.length > 0) {
                return res.status(200).json({ success:true , results: results });
            } else {
                return res.status(200).json({ success: false, msg: "no packeges where found" });   
            }
        });
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;