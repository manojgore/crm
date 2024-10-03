const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/resetpass', (req, res) => {
    const { email, newpassword } = req.body;
    pool.query('SELECT * FROM customer_registration WHERE email = ?', [email], (err, result) => {
        if (err) {
            return res.json({ "error": err });
        } else {
            if (result.length > 0) {
                // User got successfully
                pool.query('UPDATE customer_registration SET password = ? WHERE email = ?', [newpassword, email], (updateerr, updateresult) => {
                    if (err) {
                        return res.json({ "error": err });
                    } else{
                        if(updateresult.affectedRows > 0){
                            return res.json({ result: updateresult, success: true });
                        }else{
                            return res.json({ error: 'Undable to reset password', success: false });
                        }
                    }
                })
            } else {
                // User was not found
                return res.json({result:result, "error": "No such user found", success: false });
            }
        }
    });
});
module.exports = router;