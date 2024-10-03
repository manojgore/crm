const nodemailer = require("nodemailer");
require("dotenv").config();

// Example usage
const sendOTP = async (email, mailsubject, content) => {
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
      to: email, // list of receivers
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

module.exports = sendOTP;
