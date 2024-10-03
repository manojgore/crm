const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/checksubscription', async(req, res)=>{
    const { id } = req.body;

    try {
        pool.query('SELECT * FROM customer_registration WHERE id = ?', [id], (err, results) => {
            if(results && results[0].subscribed === 1){
                pool.query('SELECT * FROM company_settings WHERE id = ?', [id], (error, companyResults) => {
                    return res.status(201).json({ message: 'Customer is subscribed',  subscribed: true, plan_type: companyResults[0].plan_type, freetaxfiled: results[0].freetaxfiled });
                });
            }else{
                return res.status(201).json({ message: 'Customer is not subscribed',  subscribed: false});
            }
        });
    } catch (error) {
        console.error('Error registering customer:', error);
        return res.status(500).json({ error: error });
    }

});

module.exports = router;