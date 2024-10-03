const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getuserdetails', async(req, res)=>{
    const { id } = req.headers;
   try {
        pool.query("SELECT * FROM customer_registration WHERE id = ?", [id], (err, results) => {
            if (err) {
                console.error("Error to fetch the user", err);
                return res.status(500).json({ error: err });
            }
            pool.query("SELECT * FROM accountsettings WHERE id = ?", [id], (accountSettingsErr, accountSettingsResults)=>{
                if (accountSettingsErr) {
                    console.error("Error to fetch the user settings", accountSettingsErr);
                    return res.status(500).json({ error: accountSettingsErr });
                }

                if (results && results.length > 0) {
                    return res.status(200).json({ success:true , results: results, accountSettings: accountSettingsResults });
                } else {
                    return res.status(200).json({ success: false, msg: "no user where found" });   
                }
            });
        });
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;