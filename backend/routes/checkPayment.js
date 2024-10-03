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

router.get("/checkpayment", (req, res) => {
  const { marchenttransactionid } = req.headers;
  console.log("marchent trans id: ", marchenttransactionid);

  try {
    const xVerify = sha256(`/pg/v1/status/${marchantId}/${marchenttransactionid}` + saltKey) + "###" + saltKeyIndex;
    const options = {
        method: 'get',
        url: `${hostURL}/pg/v1/status/${marchantId}/${marchenttransactionid}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            "X-MERCHANT-ID": marchenttransactionid,
            "X-VERIFY": xVerify
        },
      
    };
    axios
    .request(options)
        .then(function (response) {
        
        if(response.data.success){
            res.status(200).json({success: true});
        }else{
            res.status(200).json({success: true});
        }
    })
    .catch(function (error) {
        console.error(error);
    });
  } catch (error) {
    res.status(503).json({success: false, error: error})
  }
});

module.exports = router;
