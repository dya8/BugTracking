import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const socket = io("http://localhost:3000"); // Replace with your backend URL

const Chatroom = () => {
  const [testers, setTesters] = useState([]);
  const [selectedTester, setSelectedTester] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const developer_id = 1; // Replace with the actual logged-in developer ID

  // Fetch the list of testers who assigned bugs to the developer
  useEffect(() => {
    const fetchTesters = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/chat/testers/${developer_id}`);
        setTesters(response.data); // Expecting testers list from backend
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching testers:", error);
      }
    };
    fetchTesters();
  }, []);


async function handleSelectTester(tester) {
  try {
    // Make sure tester object is valid
    if (!tester || !tester.tester_id) {
      throw new Error("Invalid tester data provided.");
    }

    console.log("Selecting tester:", tester);

    // Request data for chatroom creation/fetch
    const requestData = {
      developer_id: developer_id, // Ensure developer_id is defined in the scope
      tester_id: tester.tester_id,
    };
    console.log("📤 Sending request data:", requestData);
    // Ensure request data is valid
    if (typeof requestData !== "object" || requestData === null) {
      throw new Error("Invalid request data: must be a valid object.");
    }

    // API call to fetch or create a chatroom
    const response = await axios.post(
      "http://localhost:3000/api/chat/chatroom", // Replace with actual endpoint
      requestData,
      {
        headers: {
          "Content-Type": "application/json", // Ensure JSON request
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
    setSelectedTester({ ...tester, chatroom_id: chatroom.chatroom_id });

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
}


  

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (newMsg) => {
      console.log("📥 New message received in frontend:", newMsg);
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    });
  
    return () => {
      socket.off("receiveMessage");
    };
  }, []);
  

  // Send a message
 
  const sendMessage = async () => {
    console.log("Selected Tester before sending message:", selectedTester);
  
    if (!newMessage.trim()) {
      console.log("Message is empty. Not sending.");
      return;
    }
    if (!selectedTester) {
      console.log("No tester selected. Not sending.");
      return;
    }
    if (!selectedTester.chatroom_id) {
      console.log("No chatroom ID found. Not sending.");
      return;
    }
  
    const messageData = {
      chatroom_id: selectedTester.chatroom_id,
      sender_id: developer_id,
      sender_type: "Developer",
      message: newMessage
    };
  
    console.log("Sending message:", messageData);

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
          {/* Tester List */}
          <div className="w-1/4 bg-white border-r p-4">
            <h2 className="text-purple-700 text-xl font-semibold">Testers</h2>
            {testers.map((tester) => (
              <div
                key={tester.tester_id}
                className={`p-3 mt-2 rounded-lg cursor-pointer font-semibold text-purple-700 border ${
                  selectedTester?.tester_id === tester.tester_id ? "bg-purple-200" : "hover:bg-purple-100"
                }`}
                onClick={() => {console.log("🟡 Clicked tester:", tester);
                  handleSelectTester(tester);}}
              >
                {tester.tester_name} ({tester.project_name})
              </div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedTester ? (
              <>
                <div className="bg-gray-200 p-4 font-semibold text-purple-700 text-lg border-b">
                  Chat with {selectedTester.tester_name} ({selectedTester.project_name})
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 rounded-lg ${
                      msg.sender_type === "Developer" ? "bg-purple-700 text-white self-end" : "bg-gray-300 text-gray-800 self-start"
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
                Select a tester to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
