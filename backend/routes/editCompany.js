const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/editCompany", (req, res) => {
    const { name, email, phoneNumber, website, password, address, plan, planType, purchased_on, expiring_on } = req.body;
    console.log(expiring_on);

    // Updating the customer_registration
    pool.query("UPDATE customer_registration SET number = ? WHERE email = ?", [phoneNumber, email], (error, result)=>{
        if (error) {
            console.error("Error checking for duplicate user:", error);
            return res.status(500).json({ error: error });
        }

        // Updating hte company_settings
        pool.query("UPDATE company_settings SET company_name = ?, company_address = ?, plan_type = ?, plan = ?, purchased_on = ?, expiring_on = ? WHERE company_email = ?", [name, address, planType, plan, purchased_on ? purchased_on.slice(0, 19).replace('T', ' ') : null, expiring_on ? expiring_on.slice(0, 19).replace('T', ' ') : null, email], (selectErr, selectResult) => {
            if (selectErr) {
                console.error("Error checking for duplicate user:", selectErr);
                return res.status(500).json({ error: selectErr });
            }
            console.log(selectResult)
            res.status(200).json({ result: result, result2: selectResult, message: 'Company edited successfully', success: true });
        })
    })
    
});

module.exports = router;
