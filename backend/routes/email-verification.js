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

router.post("/sendEmail", async (req, res) => {
    const { email } = req.body;

    // Generate a new random 4-digit number for OTP
    try {
        const random4DigitNumber = generateRandom4DigitNumber();

        const mailSubject = "Mail verification";
        const mailContent = `<p>Hi, please verify your email address <b>OTP : ${random4DigitNumber}</b></p>`;

        await sendOTP(email, mailSubject, mailContent);

        return res.status(201).json({ message: 'Email sent for verification', otp: random4DigitNumber, success: true });
    } catch (error) {
        return res.status(201).json({ error: error, success: false });
    }

    // Insert the email and OTP into the database
    // pool.query("INSERT INTO customer_registration (username, email, number, otp, password) VALUES (?, ?, ?, ?, ?)", [username, email, number, random4DigitNumber, 'anypass'], async (err, result) => {
    //     if (err) {
    //         console.error('Error inserting data:', err);
    //         return res.status(500).json({ error: 'Error inserting data' });
    //     }
    //     try {
    //         await sendOTP(email, mailSubject, mailContent);
    //         console.log('Email sent for verification');
    //         return res.status(201).json({ message: 'Email sent for verification', otp: random4DigitNumber });
    //     } catch (error) {
    //         console.error('Error sending verification email:', error);
    //         return res.status(500).json({ error: 'Error sending verification email' });
    //     }
    // });
});

module.exports = router;
