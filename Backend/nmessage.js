
const express = require("express");
const nodemailer = require("nodemailer");
const db=require("../Backend/db");
const app = express();
const PORT = 3000;
app.use(express.json()); 




// 📩 Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "diyadileep0806@gmail.com", // Your email
    pass:"djmm zavk kkxo pkik", // App password
  },
});

// Function to send an email
const sendEmailNotification = async (testerEmail, developerName, message) => {
  const mailOptions = {
    from:"diyadileep0806@gmail.com",
    to: testerEmail,
    subject: `New Message from ${developerName}`,
    text: `Hey, you have a new message from ${developerName}: "${message}"\n\nLogin to check your messages.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${testerEmail}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// API to handle sending messages
exports.sendMessage = async (req, res) => {
  try {
    const { chatroom_id, sender_id, sender_type, message } = req.body;

    // Save message to the database
    const newMessage = await db.Message.create({
      chatroom_id,
      sender_id,
      sender_type,
      message,
      timestamp: new Date(),
    });

    // Fetch tester's email (assuming the tester is in the database)
    const chatroom = await db.Chatroom.findOne({ where: { id: chatroom_id } });
    const tester = await db.Tester.findOne({ where: { tester_id: chatroom.tester_id } });

    if (tester && tester.email) {
      // Fetch developer name
      const developer = await db.Developer.findOne({ where: { developer_id: sender_id } });

      if (developer) {
        sendEmailNotification(tester.email, developer.name, message);
      }
    }

    // Emit message to frontend via Socket.io
    req.io.to(chatroom_id).emit("receiveMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};