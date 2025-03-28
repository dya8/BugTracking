const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { Chatroom } = require("../db");

function setupChatSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5174",
            methods: ["GET", "POST"]
        }
    });
    global.io = io; // ✅ Set global.io here

    // Store connected users (socket.id mapped to user ID)
    const connectedUsers = {};
    
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

               // connectedUsers[user_id] = socket.id; 
        
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
          
            // ✅ Emit a confirmation event for user
            io.to(messageData.chatroom_id).emit("messageSent", {
                message: messageData.message,
                sender: messageData.sender_type,
            });
             /* ✅ Notify recipient about new message
             const recipient_id = messageData.sender_type === "developer" 
            ? chatroom.tester_id 
            : chatroom.developer_id; */
          
            // Notify recipient about new message using socket.io

           // console.log("📌 Sending notification to:", recipient_id, "Socket ID:", connectedUsers[recipient_id]);
            /*const recipientSocket = Object.entries(connectedUsers).find(
                ([, user]) => user.userId === recipient_id
            );*/
           /* if (connectedUsers[recipient_id]) {
                io.to(connectedUsers[recipient_id]).emit("newMessage", {
                    chatroom_id: messageData.chatroom_id,
                    message: messageData.message,
                    sender: messageData.sender_type,
                });*/
           /* if (recipientSocket) {
                io.to(recipientSocket[0]).emit("newMessage", {
                    chatroom_id: messageData.chatroom_id,
                    message: messageData.message,
                    sender: messageData.sender_type,
                });*/

    /* console.log("🔔 Notification sent to recipient:", recipient_id);
    } else {
            console.log("�� No recipient found for:", recipient_id);

            } */
         } catch (error) {
              console.error("❌ Error storing message:", error);
              socket.emit("messageError", { success: false, error: error.message });
            }
          });

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            // Remove the disconnected user from the connected users list
            for (const userId in connectedUsers) {
                if (connectedUsers[userId] === socket.id) {
                    delete connectedUsers[userId];
                    console.log(`ℹ️ Removed user ${userId} from connected users`);
                    break;
                }
            }
        });
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    
    // Ensure MongoDB is ready before watching changes
    mongoose.connection.once("open", () => {
        console.log("✅ MongoDB Connected. Starting Change Stream...");
        watchChatroomChanges(io);
    });
    return io;
}

// ✅ Function to watch for MongoDB changes
async function watchChatroomChanges(io) {
    try {
        const chatroomCollection = mongoose.connection.collection("chatrooms");
        const changeStream = chatroomCollection.watch([], { fullDocument: "updateLookup" });

        changeStream.on("change", async (change) => {
            if (change.operationType === "update" && change.updateDescription.updatedFields.messages) {
                const chatroomId = change.documentKey._id;
                const updatedChatroom = await Chatroom.findById(chatroomId);
                const lastMessage = updatedChatroom.messages[updatedChatroom.messages.length - 1];

                if (lastMessage) {
                    console.log("🆕 New message detected:", lastMessage);

                    const recipient_id = lastMessage.sender_type === "developer"
                        ? updatedChatroom.tester_id
                        : updatedChatroom.developer_id;

                    console.log("🔔 Sending real-time update to:", recipient_id);

                    io.to(chatroomId.toString()).emit("newMessage", {
                        chatroom_id: chatroomId.toString(),
                        message: lastMessage.message,
                        sender: lastMessage.sender_type,
                    });

                    console.log("✅ Real-time update sent!");
                }
            }
        });

        changeStream.on("error", (err) => {
            console.error("❌ MongoDB Change Stream Error:", err);
        });

    } catch (error) {
        console.error("❌ Error setting up MongoDB Change Stream:", error);
    }
}

// ✅ Export both functions properly
module.exports = { setupChatSocket, watchChatroomChanges };