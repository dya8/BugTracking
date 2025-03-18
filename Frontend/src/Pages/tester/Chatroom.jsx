import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Card, CardContent, TextField, Button } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const socket = io("http://localhost:3000"); // Adjust backend URL if needed

const ChatroomTester = () => {
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const tester_id = 1; // Replace with actual logged-in tester ID

  // Fetch developers assigned to this tester
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/chat/developers/${tester_id}`);
        setDevelopers(response.data); // Expecting testers list from backend
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching testers:", error);
      }
    };
    fetchDevelopers();
  }, []);

  // 📌 Handle selecting a developer and joining the chatroom
const handleSelectDeveloper = async (developer) => {
  try {
    // Validate developer object
    if (!developer || !developer.developer_id) {
      throw new Error("Invalid developer data provided.");
    }

    console.log("Selecting developer:", developer);

    // Request data for chatroom creation/fetch
    const requestData = {
      developer_id: developer.developer_id,
      tester_id, // Ensure tester_id is defined in the scope
    };
    console.log("📤 Sending request data:", requestData);

    // Ensure request data is valid
    if (typeof requestData !== "object" || requestData === null) {
      throw new Error("Invalid request data: must be a valid object.");
    }

    // API call to fetch or create a chatroom
    const response = await axios.post(
      "http://localhost:3000/api/chat/chatroom", // Ensure endpoint matches backend
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Chatroom response:", response.data);

    // Validate response
    const chatroom = response.data;
    if (!chatroom || !chatroom.chatroom_id) {
      throw new Error("Chatroom ID is missing in response!");
    }

    console.log("✅ Chatroom ID:", chatroom.chatroom_id);

    // Update state AFTER chatroom ID is available
    setSelectedDeveloper({ ...developer, chatroom_id: chatroom.chatroom_id });

    // Join chatroom
    socket.emit("joinChatroom", { chatroom_id: chatroom.chatroom_id });

    // Fetch chat history
    const messagesResponse = await axios.get(
      `http://localhost:3000/api/chat/messages/${chatroom.chatroom_id}`
    );

    console.log("✅ Fetched messages:", messagesResponse.data);

    setMessages(messagesResponse.data);
  } catch (error) {
    // Logging detailed error information
    console.error("❌ Error handling chatroom:", error);

    if (error.response) {
      console.error("🔍 Error response data:", error.response.data);
      console.error("🔍 Error response status:", error.response.status);
      console.error("🔍 Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("🔍 No response received:", error.request);
    } else {
      console.error("🔍 Error in request setup:", error.message);
    }
  }
};
  // without clicking on tester display msg

  // Fetch messages for a given chatroom
  const fetchMessages = async (chatroom_id) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/chatroom/${chatroom_id}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      console.log("📥 New message received in frontend:", newMsg);
      setMessages((prev) => [...prev, message]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedDeveloper || !selectedDeveloper.chatroom_id) return;

    const messageData = {
      chatroom_id: selectedDeveloper.chatroom_id,
      sender_id: tester_id,
      sender_type: "Tester",
      message: newMessage,
    };
    try {
      // Send the message to the server to store it in the database
      const response = await axios.post("http://localhost:3000/api/chat/messages", messageData);
      
      console.log("✅ Message stored in database:", response.data);

      // Emit the message to other clients
      socket.emit("sendMessage", response.data);

      // 🔥 Immediately update the chat UI
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
  } catch (error) {
      console.error("❌ Error sending message:", error);
  }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex h-full">
          {/* Developer List */}
          <div className="w-1/4 bg-white border-r p-4">
            <h2 className="text-purple-700 text-xl font-semibold">Developers</h2>
            {developers.map((developer) => (
              <div
                key={developer.developer_id}
                className={`p-3 mt-2 rounded-lg cursor-pointer font-semibold text-purple-700 border ${
                  selectedDeveloper?.developer_id === developer.developer_id
                    ? "bg-purple-200"
                    : "hover:bg-purple-100"
                }`}
                onClick={() => handleSelectDeveloper(developer)}
              >
                {developer.developer_name} ({developer.project})
              </div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedDeveloper ? (
              <>
                <div className="bg-gray-200 p-4 font-semibold text-purple-700 text-lg border-b">
                  Chat with{selectedDeveloper.developer_name} ({selectedDeveloper.project})
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 p-2 rounded-lg ${
                        msg.sender_type === "Tester"
                          ? "bg-purple-700 text-white self-end"
                          : "bg-gray-300 text-gray-800 self-start"
                      } max-w-xs`}
                    >
                      {msg.message}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t flex">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    className="ml-2 px-4 py-2 bg-purple-700 text-white rounded-lg"
                    onClick={() => {
                      console.log("Send button clicked"); // Debugging log
                      sendMessage();
                    }}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a developer to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatroomTester;
