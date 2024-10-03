const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require('fs');
const { promisify } = require('util');
const handlebars = require('handlebars');

const readFileAsync = promisify(fs.readFile);

const sendAccountOpenAlertToAdmin = async (email, username, number) => {
    const mailsubject = "Congratulation! Youre Taxrx accout were created successfully";
    const html = await readFileAsync('./adminalert.html', 'utf-8');
    var template = handlebars.compile(html);
    var replacements = {
        username: username,
        number: number,
        email: email
    };
    var content = template(replacements);
  const transporter = nodemailer.createTransport({
    host: "mail.taxrx.in",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'info@taxrx.in',
      pass: 'yCBvB.!3Ml%q',
    },
  });
  const info = await transporter.sendMail(
    {
      from: 'info@taxrx.in', // sender address
      to: 'admin@gmail.com', // list of receivers
      subject: mailsubject, // Subject line
      text: "testing our node mailer", // plain text body
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

module.exports = sendAccountOpenAlertToAdmin;
