//* Sending emails with Nodemailer -1

//Create a new file 'email.js' in the 'utils' folder.
// Install nodemailer: npm i nodemailer

//This is 'email.js' file.

//? In order to complete the password reset, we need to send the reset token via email. And we will use nodemailer to send that email.

const nodemailer = require("nodemailer"); //importing

const sendEmail = async (options) => {
  // 1) Create a transporter ( The service that actually sends the email. )
  const transporter = nodemailer.createTransport({
    service: "Gmail", //Getting sensitive data from 'config.env file'
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    // If we use, Gmail, then we will have to activate 'less secure app' option in Gmail. But Gmail is not good for a production app, so we will use something called 'Mailtrap'.
  });

  // 2) Define the email options

  // 3) Actually send the email
};

module.exports = sendEmail;
