const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/editexpenses", (req, res) => {
    const { Owner_Id, Expense_ID, Reference, Amount, Payment_Mode, Expense_Date, Payment_Status, Description, Attachment } = req.body;

    // Updating hte Invoice
    pool.query("UPDATE addexpense SET Reference = ?, Amount = ?, Payment_Mode = ?, Expense_Date = ?, Payment_Status = ?, Description = ?, Attachment = ? WHERE Owner_Id = ? AND Expense_ID = ?", [Reference, Amount, Payment_Mode, Expense_Date.slice(0, 19).replace('T', ' '), Payment_Status, Description, Attachment, Owner_Id, Expense_ID], (error, result) => {
        if (error) {
            console.error("Error checking for duplicate invoice:", error);
            return res.status(200).json({ error: error, success: false });
        }
        res.status(200).json({ result: result, msg: 'Expenses edited successfully', success: true });
    })
    
});

module.exports = router;
