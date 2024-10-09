const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/addpackage', async(req, res)=>{
    const { type, duration, price, discount, numberOfUsers, numberOfSuppliers, numberOfProducts, numberOfInvoices, description, status } = req.body;
    
   try {
        pool.query("SELECT * FROM subscription_packages WHERE Type = ? AND Duration = ?", [type, duration], (error, selectResult)=>{
            if (error) {
                console.error("Error occured while getting the package from the database", error);
                return res.status(500).json({ error: error, success: false });
            }

            if (selectResult && selectResult.length > 0) {
                return res.status(200).json({ success:false , msg: "package already exists" });
            }

            pool.query("INSERT INTO subscription_packages (Type, Duration, Price, Discount, Number_of_users, Number_of_suppliers, Number_of_products, Number_of_invoices, Description, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [type, duration, price, discount, numberOfUsers, numberOfSuppliers, numberOfProducts, numberOfInvoices, description, status], (err, results) => {
                if (err) {
                    console.error("Error getting packages from the database", err);
                    return res.status(500).json({ error: err, success: false });
                }
                
                return res.status(200).json({ success:true , results: results });
            });
        })
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;