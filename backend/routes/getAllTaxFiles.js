const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getalltaxfiles', async(req, res)=>{
   try {
        pool.query("SELECT * FROM taxfile", (err, results) => {
            if (err) {
                console.error("Error getting taxfiles from the database", err);
                return res.status(500).json({ error: err });
            }
            
            if (results && results.length > 0) {
                return res.status(200).json({ success:true , results: results });
            } else {
                return res.status(200).json({ success: false, msg: "no taxfiles where found" });   
            }
        });
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;