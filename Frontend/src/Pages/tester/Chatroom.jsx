import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { format } from "date-fns"; // Import for formatting timestamps
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const socket = io("http://localhost:3000"); // Adjust backend URL if needed

const ChatroomTester = ({testerId}) => {
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({}); // Store unread count per developer
  const tester_id = Number(testerId); // Replace with actual logged-in tester ID

  // Fetch developers assigned to this tester
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/chat/developers/${tester_id}`);
        setDevelopers(response.data);
      } catch (error) {
        console.error("Error fetching developers:", error);
      }
    };
    fetchDevelopers();
  }, []);

  // Fetch messages when a developer is selected
  useEffect(() => {
    if (selectedDeveloper) {
      fetchMessages(selectedDeveloper.chatroom_id);
      setUnreadMessages((prev) => ({ ...prev, [selectedDeveloper.developer_id]: 0 })); // Reset unread count
    }
  }, [selectedDeveloper]);

  const fetchMessages = async (chatroom_id) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/chat/messages/${chatroom_id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);

      // If the message is from a different developer, update unread count
      if (!selectedDeveloper || message.sender_id !== selectedDeveloper.developer_id) {
        setUnreadMessages((prev) => ({
          ...prev,
          [message.sender_id]: (prev[message.sender_id] || 0) + 1,
        }));
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedDeveloper]);

  const handleSelectDeveloper = async (developer) => {
    try {
      const response = await axios.post("http://localhost:3000/api/chat/chatroom", {
        developer_id: developer.developer_id,
        tester_id,
      });

      const chatroom = response.data;
      setSelectedDeveloper({ ...developer, chatroom_id: chatroom.chatroom_id });

      socket.emit("joinChatroom", { chatroom_id: chatroom.chatroom_id });
      fetchMessages(chatroom.chatroom_id);
    } catch (error) {
      console.error("Error handling chatroom:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedDeveloper || !selectedDeveloper.chatroom_id) return;

    const messageData = {
      chatroom_id: selectedDeveloper.chatroom_id,
      sender_id: tester_id,
      sender_type: "Tester",
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post("http://localhost:3000/api/chat/messages", messageData);

      socket.emit("sendMessage", response.data);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex h-[calc(110vh-150px)]">
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
                  Chat with {selectedDeveloper.developer_name} ({selectedDeveloper.project})
                </div>
                <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex mb-2 ${
                        msg.sender_type === "Tester" ? "justify-end" : "justify-start"    
                      }`}
                    >
                       <div
                        className={`p-2 rounded-lg max-w-xs ${
                          msg.sender_type === "Tester"
                            ? "bg-purple-700 text-white"
                            : "bg-purple-200 text-gray-900"
                        }`}
                        >
                        <div  className="text-sm">{msg.message}</div>
                        <div className="text-xs text-white-400 text-right mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                        </div>
                        </div>
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
                    onClick={sendMessage}
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
