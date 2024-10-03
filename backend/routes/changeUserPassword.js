const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/changepassword", (req, res) => {
    const { email, password } = req.body;

    // Updating the customer_registration
    pool.query("UPDATE customer_registration SET password = ? WHERE email = ?", [password, email], (error, result)=>{
        if (error) {
            console.error("Error checking for duplicate user:", error);
            return res.status(500).json({ error: error });
        }

        res.status(200).json({ result: result, message: 'Password Changed Successfully', success: true });
    })
    
});

module.exports = router;
