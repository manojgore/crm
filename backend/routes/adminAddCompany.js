const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require("multer");
const path = require("path");

router.post("/addCompany", (req, res) => {
    const { username, phoneNumber, mobileOtp, email, emailOtp, password, company_address, emailverified, address_line_1, address_line_2, country, state, city, pincode, plan, plan_type, company_website, registered_on, purchased_on, expiring_on } = req.body;
    console.log(plan_type, purchased_on, expiring_on)
    // Check if the email already exists
    pool.query("INSERT INTO customer_registration (username, email, number, otp, email_verified, password, subscribed) VALUES (?, ?, ?, ?, ?, ?, ?)", [username, email, phoneNumber, emailOtp, emailverified, password, plan], (selectErr, selectResult) => {
        if (selectErr) {
            console.error("Error checking for duplicate user:", selectErr);
            return res.status(500).json({ error: selectErr });
        }

        // If user already exists, return a 409 status code
        if (selectResult && selectResult.length > 0) {
            console.log(selectResult,selectResult.length)
            return res.status(409).json({ msg: 'This user is already in use', success: false });
        }

        console.log(selectResult)
         
        pool.query("INSERT INTO company_settings (id, company_name, company_address, phone_number, company_email, address_line_1, address_line_2, country, state, city, pincode, plan, plan_type, company_website, registered_on, purchased_on, expiring_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [selectResult.insertId, username, company_address, phoneNumber, email, address_line_1, address_line_2, country, state, city, pincode, plan, plan_type, company_website, registered_on.slice(0, 19).replace('T', ' '), purchased_on ? purchased_on.slice(0, 19).replace('T', ' ') : null, expiring_on ? expiring_on.slice(0, 19).replace('T', ' ') : null], (selectErr, insertResult) => {
            if (selectErr) {
                console.error("Error checking for duplicate user:", selectErr);
                return res.status(500).json({ error: selectErr });
            }
            res.status(200).json({ result: selectResult, result2: insertResult, message: 'Company added successfully', success: true });
        })
        
    })
});

module.exports = router;
