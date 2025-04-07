import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import socket from "@/socket";
const Chatroom = ({userId}) => {
  const [testers, setTesters] = useState([]);
  const [selectedTester, setSelectedTester] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const developer_id = Number(userId); // Replace with the actual logged-in developer ID
  useEffect(() => {
    console.log("🔌 Connecting to socket...");
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });
  
    return () => {
      console.log("ℹ️ Cleaning up connect listener...");
      socket.off("connect");
    };
  }, []);

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
      "http://localhost:3000/api/chat/chatroom", 
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


  


useEffect(() => {
  socket.on("receiveMessage", (newMsg) => {
    console.log("📥 New message received in frontend:", newMsg);

    if (!newMsg) {
      console.error("❌ Received an undefined or null message");
      return;
    }

    if (!newMsg.chatroom_id) {
      console.error("❌ Missing chatroom_id in received message:", newMsg);
      return;
    }

    if (!newMsg.message) {
      console.error("❌ Missing message content in received message:", newMsg);
      return;
    }

    // Check if the message belongs to the currently selected chatroom
    if (selectedTester && newMsg.chatroom_id === selectedTester.chatroom_id) {
      console.log("✅ Message belongs to current chatroom. Updating UI...");
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    } else {
      console.log("❌ Message does not match selected chatroom. Ignoring.");
    }
  });

  return () => {
    console.log("ℹ️ Cleaning up receiveMessage listener.");
    socket.off("receiveMessage");
  };
}, [selectedTester]); 


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

      //  Immediately update the chat UI
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
        <div className="flex h-[calc(110vh-150px)]">
          {/* Tester List */}
          <div className="w-1/4 bg-white border-r p-4">
            <h2 className="text-purple-700 text-xl font-semibold">Testers</h2>
            {testers.map((tester) => (
              <div
                key={tester.tester_id}
                className={`p-3 mt-2 rounded-lg cursor-pointer font-semibold text-purple-700 border ${
                  selectedTester?.tester_id === tester.tester_id ? "bg-purple-200" : "hover:bg-purple-100"
                }`}
                onClick={() => {
                  handleSelectTester(tester);
                }}
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
                <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex mb-2 ${
                        msg.sender_type === "Developer" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg max-w-xs ${
                          msg.sender_type === "Developer"
                            ? "bg-purple-700 text-white"
                            : "bg-purple-200 text-gray-900"
                        }`}
                      >
                        <div className="text-sm">{msg.message}</div>
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
                    onClick={() => {
                      console.log("Send button clicked");
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