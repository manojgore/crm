const express = require("express");
const router = express.Router();
const pool = require("../db");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { jsPDF } = require("jspdf");
require("jspdf-autotable");

// Function to create the invoice file
function createInvoice(
  company_name,
  company_address,
  company_email,
  company_phone,
  buyer_name,
  bill_to_address,
  buyer_email,
  buyer_phone,
  ship_to_address,
  invoice_number,
  invoice_date,
  products,
  invoice_subTotal,
  gst_rate,
  total_amount
) {
  // Create a new instance of jsPDF
  const doc = new jsPDF();

  // Define colors and font settings
  const blueColor = "#007BFF";
  const lightBlueColor = "#E3F2FD";
  const textColor = "#333333";

  // Helper function to draw header
  const drawHeader = () => {
    doc.setFillColor(blueColor);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 60, "F");
    doc.setTextColor("#FFFFFF");
    doc.setFontSize(24);
    doc.text("INVOICE", 20, 40);
  };

  // Helper function to draw footer
  const drawFooter = () => {
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(lightBlueColor);
    doc.rect(0, pageHeight - 40, doc.internal.pageSize.getWidth(), 40, "F");
    doc.setTextColor(textColor);
    doc.setFontSize(12);
    doc.text("Thank you for your business!", 20, pageHeight - 20);
  };

  // Draw header
  drawHeader();

  // Add Projects logo
  const logoBase64 = ""; // Add your logo as a base64 encoded string
  if (logoBase64) {
    doc.addImage(
      logoBase64,
      "PNG",
      doc.internal.pageSize.getWidth() - 60,
      10,
      50,
      50
    );
  }

  // Add Projects, billing, and shipping information
  doc.setTextColor(textColor);
  doc.setFontSize(10);

  const companyY = 70;
  const detailsX1 = 20;
  const detailsX2 = doc.internal.pageSize.getWidth() / 3;
  const detailsX3 = (2 * doc.internal.pageSize.getWidth()) / 3;

  // Company Information
  doc.text(`${company_name}`, detailsX1, companyY);
  doc.text(`${company_address}`, detailsX1, companyY + 10);
  doc.text(`Email: ${company_email}`, detailsX1, companyY + 20);
  doc.text(`Phone: ${company_phone}`, detailsX1, companyY + 30);

  // Billing Information
  doc.text("Bill To:", detailsX2 + 10, companyY);
  doc.text(`${buyer_name}`, detailsX2 + 10, companyY + 10);
  doc.text(`${bill_to_address}`, detailsX2 + 10, companyY + 20);
  doc.text(`Email: ${buyer_email}`, detailsX2 + 10, companyY + 30);
  doc.text(`Phone: ${buyer_phone}`, detailsX2 + 10, companyY + 40);

  // Shipping Information
  doc.text("Shipping Details:", detailsX3, companyY);
  doc.text(`${buyer_name}`, detailsX3, companyY + 10);
  doc.text(`${ship_to_address}`, detailsX3, companyY + 20);
  doc.text(`${buyer_phone}`, detailsX3, companyY + 30);

  // Invoice details
  doc.setFontSize(12);
  doc.setTextColor(blueColor);
  doc.text(`Invoice Number: ${invoice_number}`, detailsX1, companyY + 70);
  doc.text(
    `Date: ${new Date(invoice_date).toLocaleDateString()}`,
    detailsX1,
    companyY + 80
  );

  // Add table for items
  doc.autoTable({
    startY: companyY + 100,
    head: [["Item", "Quantity", "UQC", "Unit Price", "Total"]],
    body: products,
    headStyles: {
      fillColor: blueColor,
      textColor: "#FFFFFF",
      fontStyle: "bold",
    },
    bodyStyles: {
      fillColor: lightBlueColor,
    },
    alternateRowStyles: {
      fillColor: "#FFFFFF",
    },
  });

  // Total amount
  const finalY = doc.previousAutoTable.finalY + 20;
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.text(`Subtotal: $${invoice_subTotal}`, detailsX1, finalY);
  doc.text(
    `Tax (${gst_rate}%): ${(gst_rate / 100) * invoice_subTotal}`,
    detailsX1,
    finalY + 10
  );
  doc.setFontSize(14);
  doc.setTextColor(blueColor);
  doc.text(`Total: ${total_amount}`, detailsX1, finalY + 20);

  // Draw footer
  drawFooter();

  // Save the PDF
  const pdfOutput = doc.output();
  fs.writeFileSync("invoiceFiles/invoice.pdf", pdfOutput);
}

const insertInvoice = (invoiceDeta) => {
  // Extract data from request given json
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
    item_rate,
    hsn_sac,
    goods_services,
    taxable_value,
    reverse_charge,
    quantity,
    uqc,
    no_of_pcs,
    gst_rate,
    igst,
    cgst,
    sgst_utgst,
    supply_type,
  } = invoiceDeta;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "tempfiles/");
  },
  filename: function (req, file, cb) {
    cb(null, "invoices.xlxs");
  },
});

const upload = multer({ storage: storage });

router.post("/importinvoicefromcsv", upload.single("csvfile"), (req, res) => {
  // const { csvFile } = req.body;
  // // console.log(csvFile)
  // let file = dataURLtoFile(csvFile, 'invoices.xlsx');
  // console.log(file)
  const { userid } = req.body;

  const result = excelToJson({
    sourceFile: "./tempfiles/invoices.xlsx",
    header: {
      // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
      rows: 1, // 2, 3, 4, etc.
    },
  });

  try {
    for (let obj of result.Sheet1) {
      let insertableObj = {
        id: userid,
        seller_trade_name: obj.A,
        seller_office_address: obj.B,
        seller_shipping_address: obj.C,
        seller_gstin: obj.D,
        seller_email: obj.E,
        seller_phone: obj.F,
        buyer_name: obj.G,
        buyer_email: obj.H,
        buyer_phone: obj.I,
        buyer_gstin: obj.J,
        bill_to_address: obj.K,
        ship_to_address: obj.L,
        place_of_supply: obj.M,
        invoice_type: obj.N,
        invoice_number: obj.O,
        invoice_date: new Date(Date.parse(obj.P)),
        hsn_sac: obj.Q,
        taxable_value: obj.R,
        reverse_charge: obj.S,
        gst_rate: obj.T,
        igst: obj.U,
        cgst: obj.V,
        sgst_utgst: obj.W,
        supply_type: obj.X,
        final_amount: obj.Y,
        products: [{ item: obj.Z, price: obj.AA, quantity: obj.AB, uqc: obj.AC }],
      };

      // insertInvoice(insertableObj);
      // console.log("insertion result: ", insertionResult);
      // if(!insertionResult.success){
      //     return res.status(200).json(insertionResult);
      // }
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
        taxable_value,
        reverse_charge,
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
      } = insertableObj;


      pool.query(
        "SELECT * FROM invoices WHERE invoice_number = ?",
        [invoice_number],
        (err, results) => {
          if (err) {
            console.error("Error checking for duplicate invoice number:", err);
            return res.status(500).json({ error: err });
          }
          if (results && results.length > 0) {
            return res
              .status(409)
              .json({ msg: "Invoice number already exists" });
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

            createInvoice(
              seller_trade_name,
              seller_office_address,
              seller_email,
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
              gst_rate,
              final_amount
            );

            console.log(
              "current path: ",
              path.join(__dirname, "../invoiceFiles/invoice.pdf")
            );
            // let file = new File(['invoice'], "invoiceFiles/invoice.pdf");
            let fileData = fs.readFileSync("invoiceFiles/invoice.pdf", "utf-8");

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
                invoice_date,
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
                    .json({ error: "Error while entering the data", success: false });
                } else {
                  console.log("Data inserted successfully");
                  return res.status(200).json({ results: results, success: true });
                }
              }
            );
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({ error: error, success: false });
  }
});

module.exports = router;
