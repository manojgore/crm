const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/checkuser', async(req, res)=>{
    const { email } = req.headers;
   try {
        pool.query("SELECT * FROM customer_registration WHERE email = ?", [email], (err, results) => {
            if (err) {
                console.error("Error to fetch the user", err);
                return res.status(500).json({ error: err });
            }

            if(results && results.length > 0){
                return res.status(200).json({ success:true , msg: "User found" });
            }else{
                return res.status(200).json({ success:false , msg: "User not found" });
            }
        });
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;