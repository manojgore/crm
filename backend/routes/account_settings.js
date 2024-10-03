const express = require('express');
const router = express.Router();
const pool = require('../db');
// const multer = require("multer");
// const path = require("path");

// // Configure multer storage and file filtering
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, path.join(__dirname, "../accountsettings"));
//     },
//     filename: (req, file, callback) => {
//         const name = Date.now() + '-' + file.originalname;
//         callback(null, name);
//     }
// });

// const fileFilter = (req, file, callback) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//         callback(null, true);
//     } else {
//         callback(null, false);
//     }
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

// Handle POST request to add account settings
router.post("/addaccountsettiings", (req, res) => {
    // Extract data from request body
    const { TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID, PANNo, AuthorisedSignatoryName, Bankname, Branch, AccountHolderName, AccountNumber, IFSC } = req.body;

    // Check if invoice_number already exists
    pool.query("SELECT * FROM accountsettings WHERE PANNo = ? AND TradeName = ?", [PANNo, TradeName], (err, results) => {
        if (err) {
            console.error("Error checking for duplicate invoice number:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (results && results.length > 0) {
            return res.status(409).json({ error: "Account settings already exist for this PAN number and Trade name" });
        } else {
            // Insert data into the database
            // const image = req.file ? req.file.filename : null;
            pool.query("INSERT INTO accountsettings (TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID, PANNo, AuthorisedSignatoryName, Bankname, Branch, AccountHolderName, AccountNumber, IFSC) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID, PANNo, AuthorisedSignatoryName, Bankname, Branch, AccountHolderName, AccountNumber, IFSC],
                (error, results) => {
                    if (error) {
                        console.error("Error while inserting data:", error);
                        return res.status(500).json({ error: "Internal server error" });
                    } else {
                        console.log("Data inserted successfully");
                        return res.status(200).json({ message: "Account settings added successfully" });
                    }
                });
        }
    });
});

module.exports = router;
