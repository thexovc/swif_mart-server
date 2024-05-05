// index.js or main.ts
require('dotenv').config();
// console.log(process.env.EMAIL_PASS);

// Import nodemailer as a CommonJS module
const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'kyilaxtech@gmail.com',
    pass: `${process.env.EMAIL_PASS}`,
  },
});

// /* eslint-disable prettier/prettier */
// // Import nodemailer as a CommonJS module
// const nodemailer = require('nodemailer');

// // index.js or main.ts
// require('dotenv').config();
// // console.log(process.env.EMAIL_PASS);

// export const transporter = nodemailer.createTransport({
//   host: 'smtp.office365.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'GACNWebsite@gacn.com',
//     pass: `${process.env.EMAIL_PASS}`,
//   },
// });
