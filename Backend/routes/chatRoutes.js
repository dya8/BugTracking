const express = require("express");
const router = express.Router();
const { Chatroom, Bug, Tester, Developer } = require("../db");

// 📌 Get Testers Who Assigned Bugs to a Developer correct
router.get("/testers/:developer_id", async (req, res) => {
    try {
        const assignedTesters = await Bug.distinct("reported_by", { assigned_to: req.params.developer_id });
        const testers = await Tester.find({ tester_id: { $in: assignedTesters } }, "tester_id tester_name email");
        console.log(testers);
        res.json(testers);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// 📌 Get Developers Who Were Assigned Bugs by a Tester (Corrected)
router.get("/developers/:tester_id", async (req, res) => {
    try {
        const assignedDevelopers = await Bug.distinct("assigned_to", { reported_by: req.params.tester_id });
        const developers = await Developer.find({ developer_id: { $in: assignedDevelopers } }, "developer_id developer_name email");
        
        console.log(developers);
        res.json(developers);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Fetch Chatroom or Create If Not Exists// Backend (router.post("/chatroom", ...))

router.post("/chatroom", async (req, res) => {
    try {
        console.log("📩 Incoming request:", req.body);

        const { developer_id, tester_id } = req.body;
        if (!developer_id || !tester_id) {
            return res.status(400).json({ error: "Missing required fields!" });
        }

        // ✅ Check if chatroom already exists for this bug, developer, and tester
        let chatroom = await Chatroom.findOne({ developer_id, tester_id });

        if (!chatroom) {
            // ✅ Auto-generate unique chatroom_id
            const lastChatroom = await Chatroom.findOne().sort({ chatroom_id: -1 });
            const newChatroomId = lastChatroom ? lastChatroom.chatroom_id + 1 : 1;

            chatroom = new Chatroom({
                chatroom_id: newChatroomId,
                developer_id,
                tester_id,
                messages: [],
            });

            await chatroom.save();
            console.log("✅ New chatroom created:", chatroom);
            res.status(200).json({ chatroom_id: chatroom.chatroom_id, _id: chatroom._id }); // Send back chatroom_id
        } else {
            console.log("🔄 Existing chatroom found:", chatroom);
            res.status(200).json({ chatroom_id: chatroom.chatroom_id, _id: chatroom._id }); // Send back chatroom_id
        }

    } catch (err) {
        console.error("❌ Backend error in /chat/chatroom:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});


// 📌 Fetch Messages for a Chatroom
router.get("/messages/:chatroomId", async (req, res) => {
    try {
        const chatroom = await Chatroom.findOne({ chatroom_id: parseInt(req.params.chatroomId) }); // Use findOne and chatroom_id

        if (!chatroom) return res.status(404).json({ error: "Chatroom not found" });

        res.json(chatroom.messages);
    } catch (err) {
        console.error("❌ Backend error in /chat/messages:", err); //Added console error
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// 📌 Store a new message in the chatroom
router.post("/messages", async (req, res) => {
    try {
        const { chatroom_id, sender_id, sender_type, message } = req.body;

        if (!chatroom_id || !sender_id || !sender_type || !message) {
            return res.status(400).json({ error: "Missing required fields!" });
        }

        console.log("📩 New message received:", req.body);

        // Find the chatroom
        const chatroom = await Chatroom.findOne({ chatroom_id });
        if (!chatroom) {
            return res.status(404).json({ error: "Chatroom not found" });
        }

        // Add the new message
        const newMessage = {
            sender_id,
            sender_type,
            message,
            timestamp: new Date()
        };

        chatroom.messages.push(newMessage);
        await chatroom.save();

        console.log("✅ Message stored successfully:", newMessage);
        res.status(200).json(newMessage);
    } catch (err) {
        console.error("❌ Error saving message:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});


module.exports = router;
