const nodemailer = require("nodemailer");
const dotenv = require("dotenv");



const sendEmail = async (options) => {
  try {
    //create a transporter
    const transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      service: 'gmail',
      port:587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
    });

    // Ensure that the options object contains the email recipient(s)
    if (!options.email) {
      throw new Error("Recipient email address is missing");
    }

    //define the options
    const mailOptions = {
      from: "noreply@MTIS.org",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    //send the email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
