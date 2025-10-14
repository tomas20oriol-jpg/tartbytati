const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  // Define email options
  const mailOptions = {
    from: `tartbytati <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };
  
  // Send email
  const info = await transporter.sendMail(mailOptions);
  
  console.log('Email sent:', info.messageId);
};

module.exports = sendEmail;
