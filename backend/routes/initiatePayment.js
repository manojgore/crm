const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");
const uniqid = require('uniqid');
const sha256 = require('sha256');

const hostURL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const marchantId = "PGTESTPAYUAT86";
const saltKey = "96434309-7796-489d-8924-ab56988a6076";
const saltKeyIndex = 1

router.get("/initiatepayment", (req, res) => {
  const { id, planprice } = req.headers;
  const marchentTransactionId = uniqid();
  console.log("planPrice", planprice)
  try {
    pool.query("SELECT * FROM customer_registration WHERE id = ?", [id],(error, results)=>{
        if (error) {
            console.error("Error checking for duplicate user:", error);
            return res.status(500).json({ error: error, success: false });
        }
        const payload = {
            "merchantId": marchantId,
            "merchantTransactionId": marchentTransactionId,
            "merchantUserId": id,
            "amount": parseInt(planprice)*100,
            // "redirectUrl": `http://localhost:5173/check-payment/${marchentTransactionId}`,
            "redirectUrl": `http://taxrx.in/check-payment/${marchentTransactionId}`,
            "redirectMode": "REDIRECT",
            "mobileNumber": results[0].number,
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }
    
        const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
        const base64EncodedPayload = bufferObj.toString("base64");
        const xVerify = sha256(base64EncodedPayload + "/pg/v1/pay" + saltKey) + "###" + saltKeyIndex;
    
        const options = {
          method: "post",
          url: `${hostURL}/pg/v1/pay`,
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerify
          },
          data: {
            request: base64EncodedPayload
          },
        };
        axios
        .request(options)
        .then(function (response) {
            res.status(200).json({success: true, url: response.data.data.instrumentResponse.redirectInfo.url})
        })
        .catch(function (error) {
            console.log(error);
            res.status(200).json({error: error, success: false});
        });
    })
  } catch (error) {
    
  }
});

module.exports = router;
