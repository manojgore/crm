const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post("/vendorssettiings", (req, res) => {
    const { TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID, PANNo, AuthorisedSignatoryName, Bankname, Branch, AccountHolderName, AccountNumber, IFSC } = req.body;

    pool.query("SELECT * FROM vendors_profile WHERE PANNo = ? AND TradeName = ?", [PANNo, TradeName], (err, results) => {
        if (err) {
            console.error("Error checking for duplicate PAN number and Trade name:", err);
            return res.status(500).json({ error: "Internal server error", success: false });
        }
        if (results && results.length > 0) {
            return res.status(200).json({ error: "Vendor profile already exists for this PAN number and Trade name", success: false });
        } else {
            pool.query("INSERT INTO vendors_profile (TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID, PANNo, AuthorisedSignatoryName, Bankname, Branch, AccountHolderName, AccountNumber, IFSC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID, PANNo, AuthorisedSignatoryName, Bankname, Branch, AccountHolderName, AccountNumber, IFSC],
                (error, results) => {
                    if (error) {
                        console.error("Error while inserting data:", error);
                        return res.status(200).json({ error: "Error while inserting data", success: false });
                    } else {
                        console.log("Data inserted successfully");
                        return res.status(200).json({ message: "Data inserted successfully", result:results, success: true});
                    }
                });

        }
    });
});

module.exports = router;
