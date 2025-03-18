const { Server } = require("socket.io");
const { Chatroom } = require("../db");

function setupChatSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5174",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // When a user joins a chatroom
        socket.on("joinChatroom", async ({ bug_id, project_id, developer_id, tester_id }) => {
            try {
                let chatroom = await Chatroom.findOne({ bug_id, project_id, developer_id, tester_id });
        
                // If chatroom doesn't exist, create a new one
                if (!chatroom) {
                    chatroom = new Chatroom({ 
                        bug_id, 
                        project_id, 
                        developer_id, 
                        tester_id, 
                        messages: [] 
                    });
                    await chatroom.save();
                }
        
                socket.join(chatroom._id.toString());
                console.log(`User joined chatroom: ${chatroom._id}`);
        
                // Send chatroom ID and previous messages
                socket.emit("chatroomJoined", { chatroom_id: chatroom._id, messages: chatroom.messages });
            } catch (err) {
                console.error("Error joining chatroom:", err);
                socket.emit("error", { message: "Internal server error" });
            }
        });        

       //when a msg is sent
        socket.on("sendMessage", async (messageData) => {
            console.log("📥 Backend received message:", messageData);
          
            if (!messageData.chatroom_id || !messageData.sender_id || !messageData.message) {
              console.log("❌ Missing message data. Not saving.");
              return;
            }
          
            try {
              const chatroom = await Chatroom.findOne({ chatroom_id: messageData.chatroom_id });
          
              if (!chatroom) {
                console.log("❌ Chatroom not found for chatroom_id:", messageData.chatroom_id);
                return;
              }
          
              const newMessage = {
                sender_id: messageData.sender_id,
                sender_type: messageData.sender_type,
                message: messageData.message,
                timestamp: new Date(),
              };
          
              chatroom.messages.push(newMessage); // Push message to array
              await chatroom.save(); // Save to DB
          
              console.log("✅ Message stored in DB:", newMessage);
              io.to(messageData.chatroom_id).emit("receiveMessage", newMessage);
               // ✅ Also send an API response for confirmation (optional)
            socket.emit("messageSaved", { success: true, message: newMessage });
            //toast noti
            // ✅ Emit a confirmation event for tester
            io.to(messageData.chatroom_id).emit("messageSent", {
                message: messageData.message,
                sender: messageData.sender_type,
            });
            //for devnoti.jsx
           /* io.emit("chatNotification", {
                chatroom_id: messageData.chatroom_id,
                message: `New message from ${messageData.sender_type === 'Tester' ? 'Tester' : 'Developer'}!`,
                time: new Date().toLocaleTimeString(),
              });
            console.log("🔔 Emitting Notification:", notification);
            io.emit("chatNotification", notification);*/
            } catch (error) {
              console.error("❌ Error storing message:", error);
              socket.emit("messageError", { success: false, error: error.message });
            }
          });

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = setupChatSocket;
