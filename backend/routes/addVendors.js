const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post("/addVendors", (req, res) => {
    // Extract data from request body
    const { name,email,phone_number,gst_number,pan_number,address_line_1,address_line_2,country,city,state,pincode,bank_name,branch,account_holder_name,account_number,ifsc_code } = req.body;

    // Check if invoice_number already exists
    pool.query("SELECT * FROM vendors WHERE pan_number = ?", [pan_number], (err, results) => {
        if (err) {
            console.error("Error checking for duplicate invoice number:", err);
            return res.status(500).json({ error: err });
        }
        if (results && results.length > 0) {
            return res.status(200).json({ msg: `Vendor with PAN number ${pan_number} already exists`, success: false });
        } else {
            // Insert data into the database
            pool.query("INSERT INTO vendors (name,email,phone_number,gst_number,pan_number,address_line_1,address_line_2,country,city,state,pincode,bank_name,branch,account_holder_name,account_number,ifsc_code) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [name,email,phone_number,gst_number,pan_number,address_line_1,address_line_2,country,city,state,pincode,bank_name,branch,account_holder_name,account_number,ifsc_code], 
                (error, results) => {
                    if (error) {
                        console.error("Error while inserting data:", error);
                        return res.status(200).json({ error: "Error while entering the data", success: false });
                    } else {
                        console.log("Data inserted successfully");
                        return res.status(200).json({ results: results, success: true });
                    }
            });
        }
    });
});

module.exports = router;
