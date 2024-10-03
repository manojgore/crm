const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/checktaxfile', async(req, res)=>{
    const { id } = req.headers;

    try {
        pool.query('SELECT * FROM customer_registration WHERE id = ?', [id], (err, results) => {
            if(err){
                console.log("Error fetching the customer: ", err);
                return res.status(500).json({error: err});
            }
            if(results.length > 0 && results[0].taxfiled === 1){
                return res.status(201).json({ message: 'Customer has filed tax this month',  taxfiled: true, success: true});
            }else{
                return res.status(201).json({ message: 'Customer has not filed tax this month',  taxfiled: false, success: false});
            }
        });
    } catch (error) {
        console.error('Error checking taxfiles:', error);
        return res.status(500).json({ error: error });
    }

});

module.exports = router;