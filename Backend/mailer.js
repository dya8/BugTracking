const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", // email service provider
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'diyadileep0806@gmail.com', // sender email address
    pass: 'weod spxo fhxi ddpz', // google authenticated password
  },
});

const mailOptions = {
  from: 'Admin <diyadileep0806@gmail.com>', // sender address
  to: "anjaliharish2004@gmail.com", // list of receivers
  subject: "Welcome to Bug Tracking System – Your Login Details", // Subject line
  html: `
    Dear [Recipient's Name],<br><br>
    You have been added as a <b>[Role: Project Manager/Developer/Tester]</b> to Bug Tracking System by [Admin's Name].<br><br>
    To access your account, please use the following credentials:<br><br>
    🔹 <b>Login Portal:</b> <a href="[Insert Login Link]">[Insert Login Link]</a><br>
    🔹 <b>Email ID:</b> [Recipient's Email]<br>
    🔹 <b>Password:</b> [Shared Password]<br><br>
    ⚡ Please use your company email ID and the provided password to log in.<br><br>
    If you have any questions or need assistance, feel free to reach out to [Support Contact or Admin Email].<br><br>
   
  `,
  
};

const sendMail = async () => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email has been sent');
  } catch (error) {
    console.error(error);
  }
};

sendMail();
