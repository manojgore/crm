const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/editCustomer", (req, res) => {
    const { account_holder_name, account_number, address_line_1, address_line_2, bank_name, branch, city, country, email, gst_number, id, ifsc, image, name, owner_id, panNo, phone, pincode, state , company_address, company_name, number, position, website, Password} = req.body;

    // Updating hte Invoice
    pool.query("UPDATE customers SET website=?, position=?, number=?,company_name=?,company_address = ?, account_holder_name = ?, account_number = ?, address_line_1 = ?, address_line_2 = ?, bank_name = ?, branch = ?, city = ?, country = ?, email = ?, gst_number = ?, ifsc = ?, image = ?, name = ?, panNo = ?, phone = ?, pincode = ?, state = ? WHERE owner_id = ? AND id = ?", [website, position, number, company_name, company_address, account_holder_name, account_number, address_line_1, address_line_2, bank_name, branch, city, country, email, gst_number, ifsc, image, name, panNo, phone, pincode, state, owner_id, id], (error, result) => {
        if (error) {
            console.error("Error checking for duplicate invoice:", error);
            return res.status(200).json({ error: error, success: false });
        }

        pool.query('UPDATE customer_registration SET password = ?, email = ? WHERE id = ?', [Password, email, owner_id], (updateerr, updateresult) => {
            if (updateerr) {
                return res.json({ "error": updateerr });
            } else{
                if(updateresult.affectedRows > 0){
                    return res.status(200).json({ result: updateresult, msg: 'Customer edited successfully', success: true });
                    
                }else{
                    return res.json({ error: 'unable to reset password', success: false });
                }
            }
        })
        
    })
});

module.exports = router;
