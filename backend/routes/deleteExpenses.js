const express = require('express');
const router = express.Router();
const pool = require('../db');

router.delete("/deleteexpenses", (req, res) => {
    const { owner_id, expense_id } = req.headers;
    // Deleting the expense
    pool.query("DELETE FROM addexpense WHERE Owner_Id = ? AND Expense_ID = ?", [owner_id, expense_id], (error, result)=>{
        if(error){
            console.error("Error checking for duplicate user:", error);
            return res.status(200).json({ error, success: false });
        }

        res.status(200).json({ result, msg: 'Invoice deleted successfully', success: true });
    })
});

module.exports = router;
