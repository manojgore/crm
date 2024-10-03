const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/editVendor", (req, res) => {
    const { account_holder_name, account_number, address_line_1, address_line_2, bank_name, branch, city, country, email, gst_number, id, ifsc_code, name, owner_id, pan_number, phone_number, pincode, state } = req.body;

    // Updating hte Invoice
    pool.query("UPDATE vendors SET account_holder_name = ?, account_number = ?, address_line_1 = ?, address_line_2 = ?, bank_name = ?, branch = ?, city = ?, country = ?, email = ?, gst_number = ?, ifsc_code = ?, name = ?, pan_number = ?, phone_number = ?, pincode = ?, state = ? WHERE owner_id = ? AND id = ?", [account_holder_name, account_number, address_line_1, address_line_2, bank_name, branch, city, country, email, gst_number, ifsc_code, name, pan_number, phone_number, pincode, state, owner_id, id], (error, result) => {
        if (error) {
            console.error("Error checking for duplicate invoice:", error);
            return res.status(200).json({ error: error, success: false });
        }
        res.status(200).json({ result: result, msg: 'Invoice edited successfully', success: true });
    })
    
});

module.exports = router;
