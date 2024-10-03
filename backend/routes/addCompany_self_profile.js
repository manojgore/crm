const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post("/addCompanyProfile", (req, res) => {
    // Extract data from request body
    const {TradeName,GSTNo,OfficeAddress,State,StateCode,PhoneNumber,EmailID,PANNo,AuthorisedSignatoryName,BankDetails} = req.body;

    // Check if invoice_number already exists
    pool.query("SELECT * FROM company_self_profile WHERE PANNo = ? AND TradeName = ?", [PANNo,TradeName], (err, results) => {
        if (err) {
            console.error("Error checking for duplicate invoice number:", err);
            return res.status(500).json({ error: err });
        }
        if (results && results.length > 0) {
            return res.status(409).json({ msg: "company profile already exists" });
        
        } else {
            // Insert data into the database
            pool.query("INSERT INTO company_self_profile (TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID, PANNo, AuthorisedSignatoryName, BankDetails) VALUES (?,?,?,?,?,?,?,?,?,?)",
                [TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID, PANNo, AuthorisedSignatoryName, BankDetails],
                (error, results) => {
                    if (error) {
                        console.error("Error while inserting data:", error);
                        return res.status(500).json({ error: "Error while entering the data" });
                    } else {
                        console.log("Data inserted successfully");
                        return res.status(200).json({ results: results });
                    }
                });
        }
    });
});

module.exports = router;
