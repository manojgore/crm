const nodemailer = require("nodemailer");
const fs = require('fs');
const { promisify } = require('util');
const handlebars = require('handlebars');

const readFileAsync = promisify(fs.readFile);

const sendTaxFileComplete = async (toEmail, acknowledgement_no) => {

    const mailsubject = "Congratulation! You Tax file was Successfull";
    const html = await readFileAsync('./taxfiledone.html', 'utf-8');
    var template = handlebars.compile(html);
    var replacements = {
      acknowledgement_no: acknowledgement_no
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

module.exports = sendTaxFileComplete;
