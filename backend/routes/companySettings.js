const express = require('express');
const router = express.Router();
const pool = require('../db');
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, path.join(__dirname, "../uploadimages"));
//     },
//     filename: (req, file, callback) => {
//         const name = Date.now() + '-' + file.originalname;
//         callback(null, name);
//     }
// });

// const upload = multer({ storage: storage });

router.post("/addCompanySettings", (req, res) => {
    // Extract data from request body
    const { company_name, company_address, phone_number, company_email, address_line_1, address_line_2, country, state, city, pincode } = req.body;
    console.log( company_name, company_address, phone_number, company_email, address_line_1, address_line_2, country, state, city, pincode )
    // Check if company_email already exists
    pool.query("SELECT * FROM company_settings WHERE company_email = ?", [company_email], (err, results) => {
        if (err) {
            console.error("Error checking for duplicate company email:", err);
            return res.status(500).json({ error: err });
        }
        if (results && results.length > 0) {
            return res.status(409).json({ msg: "Company already exists" });
        } else {
            // Insert data into the database
            pool.query("INSERT INTO company_settings (company_name, company_address, phone_number, company_email, address_line_1, address_line_2, country, state, city, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [company_name, company_address, phone_number, company_email, address_line_1, address_line_2, country, state, city, pincode], 
                (error, results) => {
                    if (error) {
                        console.error("Error while inserting company data:", error);
                        return res.status(500).json({ error: "Error while entering the company data" });
                    } else {
                        console.log("Company data inserted successfully");
                        console.log({result:results})
                        // Upload images to the server and store their paths in the database
                        // const imagePaths = req.files.map(file => file.path.slice(file.path.lastIndexOf("\\")));
                        // pool.query("UPDATE company_settings SET site_logo = ?, favicon = ?, company_icon = ? WHERE company_email = ?",
                        //     [imagePaths[0], imagePaths[1], imagePaths[2], company_email],
                        //     (error, results) => {
                        //         if (error) {
                        //             console.error("Error updating company images:", error);
                        //             return res.status(500).json({ error: "Error updating company images" });
                        //         } else {
                        //             console.log("Company images updated successfully");
                        //             return res.status(200).json({ message: "Company settings updated successfully",result:results });
                        //         }
                        //     }
                        // );
                    }
                }
            );
        }
    });
});

module.exports = router;
