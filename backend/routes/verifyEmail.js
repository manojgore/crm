// Route for verifying email
const pool = require('../db');
const verifyEmail = (req, res) => {
    let {otp,email}=req.body;
    console.log(otp, email)
    pool.query('SELECT * FROM customer_registration WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: err.message });
        }
        // console.log(results)
        if (results[0].otp===otp) {
            pool.query('UPDATE customer_registration SET otp = 0, email_verified = 1 WHERE id = ?', [results[0].id], (err, result) => {
                console.log(results[0].id)
                // console.log("line 13")
                if (err) {
                    console.error(err.message);
                    return res.status(500).send({ error: err.message });
                }
                return res.send({ "mail verified": "Mail verified successfully" });
            });
        } else {
            return res.status(404).send('Mail not verified');
        }
    });
};

module.exports= verifyEmail