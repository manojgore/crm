const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/updatemobile', async (req, res) => {
    const { id, number } = req.body;

    try {
        // Check if the number is already in use
        pool.query("SELECT * FROM customer_registration WHERE number = ?", [number], (error, results)=>{
            if(error){
                console.error("Error checking for duplicate customer number:", error);
                return res.status(500).json({ error: error, success: false })
            }
            console.log(results)
            if (results && results.length > 0) {
                return res.status(200).json({ msg: "Company with same mobile number already exists", success: false });
            }

            pool.query("UPDATE customer_registration SET number = ? WHERE id = ?", [number, id], (error, results)=>{
                if(error){
                    console.error("Error checking for duplicate customer number:", error);
                    return res.status(500).json({ error: error, success: false })
                }
    
                return res.status(201).json({ message: 'Mobile number updated successfully', success: true});
            });
        });
        
    } catch (error) {
        console.error('Error registering customer:', error);
        return res.status(500).json({ error: error });
    }
});

module.exports = router;
