const express = require('express');
const router = express.Router();
const pool = require('../db');
const sendAccountOpenMail = require('./sendAccOpenMail');
const sendAccountOpenAlertToAdmin = require('./sendUserJoinAlert');

router.post('/register', async (req, res) => {
    const { username, phoneNumber, email, emailOtp, password, confirmPassword, image, company_address, emailverified, address_line_1, address_line_2, country, state, city, zipcode, plan, plan_type, company_website, registered_on, purchased_on, expiring_on, serviceType, gst } = req.body;
   
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
                console.log("res1", insertResults);
                pool.query("INSERT INTO accountsettings (TradeName, GSTNo, OfficeAddress, State, StateCode, PhoneNumber, EmailID) VALUES (?,?,?,?,?,?,?)",
                ["", gst, company_address, state, zipcode, phoneNumber, email], async (ferr, fResult) => {
                    if (ferr) {
                        console.error('Error inserting data:', ferr);
                        return res.status(500).json({ error: 'Error inserting data', success: false });
                    }
                    pool.query("INSERT INTO company_settings (id, company_name, company_address, phone_number, company_email, address_line_1, address_line_2, country, state, city, pincode, plan, plan_type, company_website, registered_on, purchased_on, expiring_on, serviceType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [insertResults.insertId, username, company_address, phoneNumber, email, address_line_1, address_line_2, country, state, city, zipcode, plan, plan_type, company_website, registered_on.slice(0, 19).replace('T', ' '), purchased_on ? purchased_on.slice(0, 19).replace('T', ' ') : null, expiring_on ? expiring_on.slice(0, 19).replace('T', ' ') : null, serviceType], (selectErr, secResult) => {
                        if (selectErr) {
                            console.error('Error inserting data:', selectErr);
                            return res.status(500).json({ error: 'Error inserting data', success: false });
                        }
                        // Sned Account oppening mail to admins and user
                        sendAccountOpenMail(email, username, phoneNumber);
                        sendAccountOpenAlertToAdmin(email, username, phoneNumber)
                        return res.status(201).json({ message: 'Customer registered successfully',  customerId: insertResults.insertId, success: true});
                    });
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
