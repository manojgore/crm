const express = require("express");
const router = express.Router();
const pool = require("../db");
const fs = require("fs");
const { promisify } = require("util");
const { jsPDF } = require("jspdf");
const path = require("path");
const sendInvoiceToCustomer = require("./sendInvoiceToUser");
const sendInvoiceToCompany = require("./sendInvoiceToCompany");
const { default: axios } = require("axios");
require("jspdf-autotable");
import("node-fetch");

function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

// Function to create the invoice file
function createInvoice(
  company_name,
  company_address,
  company_phone,
  buyer_name,
  bill_to_address,
  buyer_email,
  buyer_phone,
  ship_to_address,
  invoice_number,
  invoice_date,
  products,
  gst_rate
) {

  return new Promise((resolve, reject)=>{
    const items = [];
    for(let product of products){
      console.log(product)
      const tempObj = {
        name: product[0],
        quantity: product[1],
        unit_cost: product[3],
        description: product[2]
      };
      console.log('iteration: ', tempObj);
      items.push(tempObj);
    }

    const payload = {
      items: items,
      fields: {
        "tax": "%",
        "discounts": false
      },
      tax: gst_rate,
      logo: "http://taxrx.in/assets/images/logo.png",
      number: invoice_number,
      date: invoice_date,
      from: company_name + " " + company_address + ", " + "+91 " + company_phone,
      to: buyer_name,
      custom_fields: [
        {
          name: "Bill To Address",
          value: bill_to_address
        },
        {
          name: "Customer Phone",
          value: "+91" + buyer_phone
        },
        {
          name: "Customer Email",
          value: buyer_email
        }
      ],
      ship_to: ship_to_address,
      currency: "INR"
    }
    const options = {
      method: "post",
      url: 'https://invoice-generator.com',
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer sk_r6Tfr7q6IwQW4H2aGd1chJ8apfGbekXc'
      },
      data: payload,
    };

    axios.request(options).then((result)=>{
      console.log(result.config);
      console.log('success');

      // fs.writeFile("invoiceFiles/invoice.pdf", result.data, (err) => {
      //   if (err) {
      //     console.error('Error saving the PDF:', err); 
      //   } else {
      //     console.log('PDF saved successfully!');
      //   }
      // });

      const blob = new Blob([result.data], { type: 'application/pdf' })
      blob.arrayBuffer().then((r)=>{
        const buffer = Buffer.from(r);
        // console.log(buffer);
        resolve(buffer);
      });      
    }).catch((err)=>{
      console.log(err);
      reject(null);
    });
  })
}

router.post("/addInvoice", (req, res) => {
  // Extract data from request body
  const {
    id,
    seller_trade_name,
    seller_office_address,
    seller_shipping_address,
    seller_gstin,
    invoice_type,
    buyer_gstin,
    buyer_name,
    bill_to_address,
    ship_to_address,
    place_of_supply,
    invoice_number,
    invoice_date,
    hsn_sac,
    goods_services,
    taxable_value,
    reverse_charge,
    quantity,
    no_of_pcs,
    gst_rate,
    igst,
    cgst,
    sgst_utgst,
    supply_type,
    products,
    seller_email,
    buyer_email,
    seller_phone,
    buyer_phone,
    final_amount,
  } = req.body;

  // Check if invoice_number already exists
  pool.query(
    "SELECT * FROM invoices WHERE invoice_number = ?",
    [invoice_number],
    async(err, results) => {
      if (err) {
        console.error("Error checking for duplicate invoice number:", err);
        return res.status(500).json({ error: err });
      }
      if (results && results.length > 0) {
        return res.status(409).json({ msg: "Invoice number already exists" });
      } else {
        let productsList = [];
        for (let product of products) {
          let tempItem = [
            product.item,
            product.quantity,
            product.uqc,
            product.price,
            parseFloat(product.quantity) * parseFloat(product.price),
          ];
          productsList.push(tempItem);
        }

        const fileData = await createInvoice(
          seller_trade_name,
          seller_office_address,
          seller_phone,
          buyer_name,
          bill_to_address,
          buyer_email,
          buyer_phone,
          ship_to_address,
          invoice_number,
          invoice_date,
          productsList,
          taxable_value,
          gst_rate
        );

        // console.log(
        //   "current path: ",
        //   path.join(__dirname, "../invoiceFiles/invoice.pdf")
        // );
        // // let file = new File(['invoice'], "invoiceFiles/invoice.pdf");
        // let fileData = fs.readFileSync("invoiceFiles/invoice.pdf", "utf-8");

        // Insert data into the database
        pool.query(
          "INSERT INTO invoices (invoice_ownerid, seller_trade_name, seller_office_address, seller_shipping_address, seller_gstin, invoice_type, buyer_gstin, buyer_name, bill_to_address, ship_to_address, place_of_supply, invoice_number, invoice_date, products, hsn_sac, taxable_value, reverse_charge, no_of_pcs, gst_rate, igst, cgst, sgst_utgst, supply_type, seller_email, buyer_email, seller_phone, buyer_phone, final_amount, invoice_file) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            id,
            seller_trade_name,
            seller_office_address,
            seller_shipping_address,
            seller_gstin,
            invoice_type,
            buyer_gstin,
            buyer_name,
            bill_to_address,
            ship_to_address,
            place_of_supply,
            invoice_number,
            new Date(invoice_date),
            JSON.stringify(products),
            hsn_sac,
            taxable_value,
            reverse_charge,
            no_of_pcs,
            gst_rate,
            igst,
            cgst,
            sgst_utgst,
            supply_type,
            seller_email,
            buyer_email,
            seller_phone,
            buyer_phone,
            final_amount,
            fileData,
          ],
          (error, results) => {
            if (error) {
              console.error("Error while inserting data:", error);
              return res
                .status(500)
                .json({ error: "Error while entering the data" });
            } else {
              console.log("Data inserted successfully");
              sendInvoiceToCustomer(buyer_email, buyer_name, invoice_number, taxable_value, parseFloat(taxable_value)*(parseFloat(gst_rate)/100), final_amount, ship_to_address, JSON.stringify(products));
              sendInvoiceToCompany(seller_email, buyer_name, invoice_number, taxable_value, parseFloat(taxable_value)*(parseFloat(gst_rate)/100), final_amount, ship_to_address, JSON.stringify(products))
              return res.status(200).json({ results: results });
            }
          }
        );
      }
    }
  );
});

module.exports = router;
