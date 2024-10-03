const express = require('express');
const router = express.Router();
const pool = require('../db');
const { default: axios } = require('axios');

// Function to generate a random 4-digit number
function generateRandom4DigitNumber() {
    // Generate a random number between 0 and 9999
    const randomNumber = Math.floor(Math.random() * 10000);

    // Pad the number with leading zeros to ensure it's 4 digits long
    const fourDigitNumber = randomNumber.toString().padStart(4, '0');

    return fourDigitNumber;
}

router.post("/sendmobileotp", async (req, res) => {
    const { name, number } = req.body;

    try {
        // Generate a new random 4-digit number for OTP
        const random4DigitNumber = generateRandom4DigitNumber();

        const response = await axios.get(`http://sms.getitsms.com/sms/api?action=send-sms&api_key=cm9vd2RzZEtGTEJlb0g9ekZ0Rmg=&to=${number}&from=SOLTNT&sms=Dear ${name}, Your OTP is ${random4DigitNumber} . Valid for 10 minutes. Please do not share this OTP. Regards Solution Torrent&p_entity_id=1101592630000079847&temp_id=1107171817559608033`);
        if(response.data.code === "ok"){
            return res.status(200).json({ message: 'OTP sent your mobile number', otp: random4DigitNumber, success: true });
        }else{
            return res.status(200).json({ error: 'Unable to send otp', otp: random4DigitNumber, success: true });
        }

        
    } catch (error) {
        return res.status(201).json({ error: error, success: false });
    }
});

module.exports = router;
