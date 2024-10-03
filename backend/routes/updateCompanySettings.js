const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/updateCompanySettings", (req, res) => {
    // Extract data from request body
    const { id, company_name, company_address, phone_number, company_email, address_line_1, address_line_2, country, state, city, pincode, site_logo, favicon, company_icon } = req.body;
    
    // Check if company_email already exists
    pool.query(
        "UPDATE company_settings SET company_name = ?, company_address = ?, phone_number = ?, address_line_1 = ?, address_line_2 = ?, country = ?, state = ?, city = ?, pincode = ?, company_email = ?, site_logo = ?, favicon = ?, company_icon = ? WHERE id = ?",
        [company_name, company_address, phone_number, address_line_1, address_line_2, country, state, city, pincode, company_email, site_logo, favicon, company_icon, id],
        (error, results) => {
            if (error) {
                console.error("Error updating data:", error);
                return res.status(200).json({ error: "Error updating data", success: false });
            }
            console.log("Company settings updated successfully");
            return res.status(200).json({ message: "Company settings updated successfully", result: results, success: true });
        }
    );
});

module.exports = router;
