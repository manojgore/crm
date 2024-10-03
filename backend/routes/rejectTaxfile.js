const express = require('express');
const router = express.Router();
const pool = require('../db');
const sendTaxFileReject = require('./SendRejectTaxFile');

router.delete('/rejecttaxfile', async(req, res)=>{
    const { id, reason } = req.body;
    console.log(req.body);
   try {
        pool.query("SELECT * FROM taxfile WHERE id = ?", [id], (err, toDelResult) => {
            if (err) {
                console.error("Error checking for duplicate item owner id:", err);
                return res.status(500).json({ error: err });
            }
            console.log('toDelResult: ', toDelResult);
            pool.query("SELECT * FROM customer_registration WHERE id = ?", [id], (userGotErr, userGotResult) => {
                if (userGotErr) {
                    console.error("Error checking for duplicate item owner id:", userGotErr);
                    return res.status(500).json({ error: userGotErr });
                }
                
                pool.query("DELETE FROM taxfile WHERE id = ?", [id], (error, deleteResult)=>{
                    if (error) {
                        console.error("Error deleting the taxfile from the database", error);
                        return res.status(500).json({ error: error, success: false});
                    }
                    pool.query("UPDATE customer_registration SET taxfiled = ? WHERE id = ?", [0, id], (customerUpdateError, customerUpdateResult)=>{
                        if (customerUpdateError) {
                            console.error("Error deleting the taxfile from the database", customerUpdateError);
                            return res.status(500).json({ error: customerUpdateError, success: false});
                        }

                        sendTaxFileReject(userGotResult[0].email, toDelResult[0].acknowledgement, reason);
                        return res.status(200).json({ success:true , result: deleteResult });
                    });
                });
            });
        });
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;