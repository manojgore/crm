const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post("/addCustomer", (req, res) => {
    const { owner_id, name, number, email, phone, gstNumber, panNo, addressLine1, addressLine2, country, city, state, pincode, bankName, branch,  accountHolderName, accountNumber, ifsc, profileimg } = req.body;

    // Check if the email already exists
    pool.query("SELECT * FROM customers WHERE phone = ?", [phone], (selectErr, selectResult) => {
        if (selectErr) {
            console.error("Error checking for duplicate user:", selectErr);
            return res.status(500).json({ error: selectErr });
        }

        // If user already exists, return a 409 status code
        if (selectResult && selectResult.length > 0) {
            console.log(selectResult,selectResult.length)
            return res.status(200).json({ msg: `Customer with phone number ${phone} is already in use`, success: false });
        }
        
        // If the email is unique, proceed with insertion
        pool.query("INSERT INTO customers (owner_id, name, number, email, phone, gst_number, panNo, address_line_1, address_line_2, country, city, state, pincode, bank_name, branch, account_holder_name, account_number, ifsc, image, registration_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [owner_id, name, number, email, phone, gstNumber, panNo, addressLine1, addressLine2, country, city, state, pincode, bankName, branch, accountHolderName, accountNumber, ifsc, profileimg, new Date()], (insertErr, insertResult) => {
            if (insertErr) {
                console.error("Error inserting customer:", insertErr);
                return res.status(200).json({ error: insertErr, success: false });
            }

            res.status(200).json({ result: insertResult, msg: 'Customer added successfully', success: true });
        });
    });
});

module.exports = router;
