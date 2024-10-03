const nodemailer = require("nodemailer");
const fs = require('fs');
const { promisify } = require('util');
const handlebars = require('handlebars');

const readFileAsync = promisify(fs.readFile);

const sendInvoiceToCustomer = async (toEmail, buyer_name, invoice_number, invoice_subtotal, gst, invoice_total, ship_to_address, products) => {
    let allProducts = [];
    for(let product of JSON.parse(products)){
      let tempProduct = product;
      tempProduct.item_total = parseFloat(product.quantity) * parseFloat(product.price);
      allProducts.push(tempProduct);
    }

    const mailsubject = "Thanks! Here is Your Invoice";
    const html = await readFileAsync('./invoiceEmailTemplate.html', 'utf-8');
    var template = handlebars.compile(html);
    var replacements = {
        buyer_name: buyer_name,
        invoice_number: invoice_number,
        invoice_subtotal: invoice_subtotal,
        gst: gst,
        invoice_total: invoice_total,
        ship_to_address: ship_to_address,
        products: allProducts
    };
    var content = template(replacements);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSS,
    },
  });
  const info = await transporter.sendMail(
    {
      from: 'info@taxrx.in', // sender address
      to: toEmail, // list of receivers
      subject: mailsubject, // Subject line
      text: "testing our node mailer", // plain text body
      html: content, // html body
      // attachments: "invoiceFiles/invoice.pdf"
    },
    (err) => {
      if (err) {
        console.log("IT has error ", err);
      } else {
        console.log("email has been send");
      }
      // console.log("Message sent:", info.messageId);
      // res.json(info)
      console.log(info);
    }
  );
};

module.exports = sendInvoiceToCustomer;
