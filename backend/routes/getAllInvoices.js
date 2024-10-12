const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getallinvoices', async(req, res)=>{
    const { id } = req.headers || undefined;
    console.log("inside getallinvoices "+id);
   try {
        pool.query("SELECT * FROM invoices", (err, results) => {
            if (err) {
                console.error("Error checking for duplicate invoice owner id:", err);
                return res.status(500).json({ error: err });
            }
            
            if (results && results.length > 0) {
                if (id != undefined) {
                    console.log("inside if"+id);
                    return res.status(200).json({ success:true , results: results.filter((invoice)=>{return invoice.invoice_ownerid == id}) });
                } else {
                    console.log("inside else "+id);
                    return res.status(200).json({ success:true , results: results });
                }
            } else {
                return res.status(200).json({ success: false, msg: "no invoices where found" });   
            }
        });
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;