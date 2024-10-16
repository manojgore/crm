
const express = require('express');
const router = express.Router();
const pool = require('../db');
const sendAccountOpenMail = require('./sendAccOpenMail');
const sendAccountOpenAlertToAdmin = require('./sendUserJoinAlert');

router.post('/register', async (req, res) => {
    const { username, phoneNumber, email, emailOtp, password, confirmPassword,panNo, image, county, state, city, zipcode, companyName,  gst, company_address, position, website } = req.body;
   
    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        // Check if the email or phone number is already in use
        pool.query("SELECT * FROM customer_registration WHERE email = ? OR number = ?", [email, phoneNumber], (error, results)=>{
            if(error){
                console.error("Error checking for duplicate customer number:", error);
                return res.status(500).json({ error: error, success: false })
            }
            console.log(results)
            if (results && results.length > 0) {
                return res.status(200).json({ msg: "Company with same email or mobile already exists", success: false });
            }

            pool.query("INSERT INTO customer_registration (username, number, email, email_verified, otp, password, role, subscribed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [username, phoneNumber, email, 1, emailOtp, password, 'user', 0], (insertErr, insertResults)=>{
                if(insertErr){
                    console.error("Error checking for duplicate customer number:", insertErr);
                    return res.status(500).json({ error: insertErr, success: false })
                }
                    // Sned Account oppening mail to admins and user
                    pool.query("INSERT INTO customers (owner_id, name, number, email, phone, gst_number, panNo, address_line_1, address_line_2, country, city, state, pincode, bank_name, branch, account_holder_name, account_number, ifsc, image, registration_date, company_name, company_address, position, website) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [insertResults.insertId, username, phoneNumber, email, "", gst, panNo, "", "", county, city, state, zipcode, "", "", "", "", "", image, new Date(),companyName,company_address, position, website], (insertErr, insertResult) => {
                        if (insertErr) {
                            console.error("Error inserting customer:", insertErr);
                            return res.status(200).json({ error: insertErr, success: false });
                        }
                        sendAccountOpenMail(email, username, phoneNumber);
                        sendAccountOpenAlertToAdmin(email, username, phoneNumber)
                        return res.status(201).json({ message: 'Customer registered successfully',  customerId: insertResults.insertId, success: true});
                    });
            })
        })

        // Insert details into account settings database 
        // pool.query('SELECT * FROM customer_registration WHERE email = ?', [email], (err, results) => {
        //     if (err) {
        //         console.error(err.message);
        //         return res.status(500).send({ error: err.message });
        //     }
        //     console.log("res1", results);
            
            
        // });
        
    } catch (error) {
        console.error('Error registering customer:', error);
        return res.status(500).json({ error: error });
    }
});

module.exports = router;
