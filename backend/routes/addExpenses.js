const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post("/addExpenses", (req, res) => {
    // Extract data from request body
    const { Owner_Id, Expense_ID, Reference, Amount, Payment_Mode, Expense_Date, Payment_Status, Description, Attachment } = req.body;

    pool.query("INSERT INTO addexpense (Owner_Id, Expense_ID, Reference, Amount, Payment_Mode, Expense_Date, Payment_Status, Description, Attachment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [Owner_Id, Expense_ID, Reference, Amount, Payment_Mode, Expense_Date, Payment_Status, Description, Attachment],
        (error, results) => {
            if (error) {
                console.error("Error while inserting data:", error);
                return res.status(500).json({ error: "Error while entering the data", success: false });
            } else {
                console.log("Data inserted successfully");
                return res.status(200).json({ results: results, success: true });
            }
        });
});

module.exports = router;
