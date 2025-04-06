
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:'diyadileep0806@gmail.com', // Store email in .env file
    pass: 'weod spxo fhxi ddpz', // Store app password in .env file
  },
});

app.post("/send-email", async (req, res) => {
  console.log("Received request:", req.body);

  const { projectManager, teamMembers } = req.body;

  if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length === 0) {
    return res.status(400).json({ message: "No team members provided" });
  }

  try {
    for (const member of teamMembers) {
      console.log(`Sending email to: ${member.email}, Role: ${member.role}`);

      const mailOptions = {
        from: `Admin <${process.env.EMAIL}>`,
        to: member.email,
        subject: "Welcome to Bug Tracking System – Your Login Details",
        html: `
          Dear User,<br><br>
          You have been added as a <b>${member.role}</b> to Bug Tracking System.<br><br>
          Your login details:<br>
          🔹 <b>Email ID:</b> ${member.email}<br>
          🔹 <b>Password:</b> [Generated Password]<br><br>
          Please log in using the provided details.<br><br>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
