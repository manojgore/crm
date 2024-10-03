const express = require('express');
const router = express.Router();
const pool = require('../db');
const uniqid = require('uniqid');
const sendTaxFileConfirmationEmail = require('./taxFileConfirmationEmail');

router.post("/taxFile", (req, res) => {
    // Extract data from request body
    const { id, file, type, free } = req.body;
    const acknowledgement = uniqid();

    // Check if taxfile already exists
    pool.query("SELECT * FROM taxfile WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error checking for duplicate taxfile id:", err);
            return res.status(500).json({ error: err });
        }
        if (results && results.length > 0) {
            return res.status(200).json({ error: `Taxfile with id ${id} already exists`, success: false });
        } else {

            // Get username with the given id
            pool.query("SELECT * FROM customer_registration WHERE id = ?", [id], (customerError, customerResult)=>{
                if (customerError) {
                    console.error("Error checking for user with id = id:", customerError);
                    return res.status(500).json({ error: customerError });
                }

                // Getting company name with given id
                pool.query("SELECT * FROM company_settings WHERE id = ?", [id], (companyerror, companyResult)=>{
                    if (companyerror) {
                        console.error("Error checking for user with id = id:", companyerror);
                        return res.status(500).json({ error: companyerror });
                    }

                    pool.query("UPDATE customer_registration SET taxfiled = ?, freetaxfiled = ? WHERE id = ?", [1, free ? 1 : customerResult.freetaxfiled, id], (customerUpdateError, customerUpdateresult)=>{
                        if (customerUpdateError) {
                            console.error("Error checking for user with id = id:", customerUpdateError);
                            return res.status(500).json({ error: customerUpdateError });
                        }
                        // Insert data into the taxfile database
                        pool.query("INSERT INTO taxfile (id, acknowledgement, company_name, user_name, type, file, filed_on) VALUES (?,?,?,?,?,?,?)",
                            [id, acknowledgement, companyResult[0].company_name, customerResult[0].username, type, file, new Date()], 
                            (error, results) => {
                                if (error) {
                                    console.error("Error while inserting data:", error); 
                                    return res.status(200).json({ error: "Error while entering the data", success: false });
                                } else {
                                    console.log("taxfile inserted successfully");
                                    console.log("toEmail: ", customerResult[0].email);
                                    sendTaxFileConfirmationEmail(customerResult[0].email, customerResult[0].username, acknowledgement);
                                    return res.status(200).json({ results: results, success: true });
                                }
                        });
                    });
                    
                });
            });
            
        }
    });
});

module.exports = router;
