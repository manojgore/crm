const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/editCustomer", (req, res) => {
    const { account_holder_name, account_number, address_line_1, address_line_2, bank_name, branch, city, country, email, gst_number, id, ifsc, image, name, owner_id, panNo, phone, pincode, state } = req.body;

    // Updating hte Invoice
    pool.query("UPDATE customers SET account_holder_name = ?, account_number = ?, address_line_1 = ?, address_line_2 = ?, bank_name = ?, branch = ?, city = ?, country = ?, email = ?, gst_number = ?, ifsc = ?, image = ?, name = ?, panNo = ?, phone = ?, pincode = ?, state = ? WHERE owner_id = ? AND id = ?", [account_holder_name, account_number, address_line_1, address_line_2, bank_name, branch, city, country, email, gst_number, ifsc, image, name, panNo, phone, pincode, state, owner_id, id], (error, result) => {
        if (error) {
            console.error("Error checking for duplicate invoice:", error);
            return res.status(200).json({ error: error, success: false });
        }
        res.status(200).json({ result: result, msg: 'Invoice edited successfully', success: true });
    })
    
});

module.exports = router;
