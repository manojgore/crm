const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put('/cancellsubscription', async(req, res)=>{
    const { id } = req.body;
   try {
        pool.query("UPDATE company_settings SET plan = ?, plan_type = ?, purchased_on = ?, expiring_on = ? WHERE id = ?", [0, null, null, null, id], (error, deleteResult)=>{
            if (error) {
                console.error("Error updating the company_settings from the database", error);
                return res.status(500).json({ error: error, success: false});
            }
            pool.query("UPDATE customer_registration SET subscribed = ? WHERE id = ?", [0, id], (cusErr, cusResult)=>{
                if (cusErr) {
                    console.error("Error updating the customer from the database", cusErr);
                    return res.status(500).json({ error: cusErr, success: false});
                }
                return res.status(200).json({ success:true , result: cusResult });
            })
        })
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;