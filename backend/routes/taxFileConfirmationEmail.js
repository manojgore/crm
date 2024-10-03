const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require('fs');
const { promisify } = require('util');
const handlebars = require('handlebars');

const readFileAsync = promisify(fs.readFile);

const sendTaxFileConfirmationEmail = async (toEmail, username, acknowledgement) => {
    const mailsubject = "Thank You for Choosing Taxrx for Your Tax File";
    const html = await readFileAsync('./taxfile.html', 'utf-8');
    var template = handlebars.compile(html);
    var replacements = {
        username: username,
        acknowledgement: acknowledgement
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
      from: process.env.EMAIL_USER, // sender address
      to: toEmail, // list of receivers
      subject: mailsubject, // Subject line
      html: content, // html body
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

module.exports = sendTaxFileConfirmationEmail;
