const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put('/editpackage', async(req, res)=>{
    const { type, duration, price, discount, numberOfUsers, numberOfSuppliers, numberOfProducts, numberOfInvoices, description, status } = req.body;
   try {
        pool.query("UPDATE subscription_packages SET Price = ?, Discount = ?, Number_of_users = ?, Number_of_suppliers = ?, Number_of_products = ?, Number_of_invoices = ?, Description = ?, Status = ? WHERE Type = ? AND Duration = ?", [price, discount, numberOfUsers, numberOfSuppliers, numberOfProducts, numberOfInvoices, description, status, type, duration], (error, updateResult)=>{
            if (error) {
                console.error("Error deleting the packege from the database", error);
                return res.status(500).json({ error: error, success: false});
            }

            return res.status(200).json({ success:true , result: updateResult });
        })
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;