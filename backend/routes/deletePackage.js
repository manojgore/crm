const express = require('express');
const router = express.Router();
const pool = require('../db');

router.delete('/deletepackage', async(req, res)=>{
    const { type, duration } = req.headers;
   try {
        pool.query("DELETE FROM subscription_packages WHERE Type = ? AND Duration = ?", [type, duration], (error, deleteResult)=>{
            if (error) {
                console.error("Error deleting the packege from the database", error);
                return res.status(500).json({ error: error, success: false});
            }

            return res.status(200).json({ success:true , result: deleteResult });
        })
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;