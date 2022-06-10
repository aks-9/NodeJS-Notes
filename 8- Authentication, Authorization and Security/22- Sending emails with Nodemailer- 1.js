//* Sending emails with Nodemailer -1

//Create a new file in utils/email.js.
// Install nodemailer: npm i nodemailer

//This is 'email.js'

const nodemailer = require("nodemailer"); //importing

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", //Getting sensitive data from 'config.env file'
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    //Activate 'less secure app' option in Gmail
  });

  // 2) Define the email options

  // 3) Actually send the email
};

module.exports = sendEmail;
