const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/updateaccountsettiings", (req, res) => {
    const { id, TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID, PANNo, AuthorisedSignatoryName, BankName, Branch, AccountHolderName, AccountNumber, IFSC, image } = req.body;
    console.log("id: ", id);
    pool.query("SELECT * FROM accountsettings WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error checking for duplicate invoice number:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!results) {
            return res.status(409).json({ error: "No id found" });
        } else {
            pool.query("UPDATE accountsettings SET TradeName = ?, GSTNo = ?, OfficeAddress = ?, State = ?, StateCode = ?, PhoneNumber = ?, EmailID = ?, PANNo = ?, AuthorisedSignatoryName = ?, BankName = ?, Branch = ?, AccountHolderName = ?, AccountNumber = ?, IFSC = ?, image = ?, PANNo = ? WHERE id = ?",
            [TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID, PANNo, AuthorisedSignatoryName, BankName, Branch, AccountHolderName, AccountNumber, IFSC, image, PANNo, id],
            (error, results) => {
                if (error) {
                    console.error("Error while updating data:", error);
                    return res.status(200).json({ error: "Error while updating the data", success: false });
                } else {
                    console.log("Data updated successfully");
                    return res.status(200).json({ results: results, success: true });
                }
            });

        }
    });
});

module.exports = router;
