const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/addItems", (req, res) => {
  // Extract data from request body
  const {
    ownerid,
    product_code,
    name,
    price,
    hsn_sac,
    item_in_stock,
    uqc,
    duration,
  } = req.body;

  // Check if any item with same product id or name exists
  pool.query(
    "SELECT * FROM items WHERE owner_id = ? AND name = ?",
    [ownerid, name],
    (err, checkResult) => {
      if (err) {
        console.error("Error while inserting data:", err);
        return res
          .status(500)
          .json({ error: "Error while entering the data", success: false });
      }

      if (checkResult && checkResult.length > 0) {
        return res
          .status(200)
          .json({
            msg: `Item with name ${name} already exists`,
            success: false,
          });
      }

      pool.query(
        "INSERT INTO items (owner_id, product_code, name, price, hsn_sac, item_in_stock, uqc, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          ownerid,
          product_code,
          name,
          price,
          hsn_sac,
          item_in_stock,
          uqc,
          duration,
        ],
        (error, results) => {
          if (error) {
            console.error("Error while inserting data:", error);
            return res
              .status(500)
              .json({ error: "Error while entering the data", success: false });
          } else {
            console.log("Data inserted successfully");
            return res.status(200).json({ results: results, success: true });
          }
        }
      );
    }
  );
});

module.exports = router;
