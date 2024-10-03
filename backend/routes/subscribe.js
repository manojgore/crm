const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");
const uniqid = require('uniqid');
const sha256 = require('sha256');

const hostURL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const marchantId = "PGTESTPAYUAT";
const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const saltKeyIndex = 1

router.put("/subscribe", (req, res) => {
  const { id, planType, purchased_on, expiring_on } = req.body;

  try {
    pool.query(
        "UPDATE customer_registration SET subscribed = ? WHERE id = ?",
        [1, id],
        (error, result) => {
          if (error) {
            console.error("Error checking for duplicate user:", error);
            return res.status(500).json({ error: error, success: false });
          }

          // Updating hte company_settings
          pool.query(
            "UPDATE company_settings SET plan = ?, plan_type = ?, purchased_on = ?, expiring_on = ? WHERE id = ?",
            [
              1,
              planType,
              purchased_on ? purchased_on.slice(0, 19).replace("T", " ") : null,
              expiring_on ? expiring_on.slice(0, 19).replace("T", " ") : null,
              id,
            ],
            (selectErr, selectResult) => {
              if (selectErr) {
                console.error("Error checking for duplicate user:", selectErr);
                return res
                  .status(500)
                  .json({ error: selectErr, success: false });
              }
              console.log(selectResult);
              res
                .status(200)
                .json({
                  result: result,
                  result2: selectResult,
                  message: "plan purchased successfully",
                  success: true,
                });
            }
          );
        }
      );
  } catch (error) {
    
  }
});

module.exports = router;
