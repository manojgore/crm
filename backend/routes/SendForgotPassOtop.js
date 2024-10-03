const express = require('express');
const router = express.Router();
const pool = require('../db');
const sendOTP = require("./sendOTP");

// Function to generate a random 4-digit number
function generateRandom4DigitNumber() {
    // Generate a random number between 0 and 9999
    const randomNumber = Math.floor(Math.random() * 10000);

    // Pad the number with leading zeros to ensure it's 4 digits long
    const fourDigitNumber = randomNumber.toString().padStart(4, '0');

    return fourDigitNumber;
}

router.post("/sendforgotpassmail", async (req, res) => {
    const { email } = req.body;

    // Generate a new random 4-digit number for OTP
    try {
        const random4DigitNumber = generateRandom4DigitNumber();

        const mailSubject = "Mail Verification for Reset Password Request";
        const mailContent = `<p>Hi, please verify your email address <b>OTP : ${random4DigitNumber}</b></p>`;

        pool.query('SELECT * FROM customer_registration WHERE email = ?', [email], async(err, result) => {
            if (err) {
                return res.json({ "error": err });
            } else {
                if (result.length > 0) {
                    // User Does not Exist
                    await sendOTP(email, mailSubject, mailContent);
                    return res.status(201).json({ message: 'Email sent for verification', otp: random4DigitNumber, success: true });
                } else {
                    // User Exist
                    return res.json({result:result, "error": "user with this email is not found", "login": "Failed" });
                }
            }
        });
    } catch (error) {
        return res.status(201).json({ error: error, success: false });
    }
});

module.exports = router;
