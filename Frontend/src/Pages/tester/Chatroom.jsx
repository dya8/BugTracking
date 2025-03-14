import React, { useState } from "react";
import { Card, CardContent, TextField, Button } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const ChatRoom = () => {
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const developers = [
    { id: 1, name: "Developer 1", project: "Project Alpha" },
    { id: 2, name: "Developer 2", project: "Project Beta" },
  ];

  const handleSelectDeveloper = (developer) => {
    setSelectedDeveloper(developer);
    setMessages([]); // Fetch chat history later
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const newMsg = { sender: "Tester", text: newMessage };
    setMessages([...messages, newMsg]);
    setNewMessage("");
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
                key={developer.id}
                className={`p-3 mt-2 rounded-lg cursor-pointer font-semibold text-purple-700 border ${
                  selectedDeveloper?.id === developer.id ? "bg-purple-200" : "hover:bg-purple-100"
                }`}
                onClick={() => handleSelectDeveloper(developer)}
              >
                {developer.name} ({developer.project})
              </div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedDeveloper ? (
              <>
                <div className="bg-gray-200 p-4 font-semibold text-purple-700 text-lg border-b">
                  {selectedDeveloper.name} ({selectedDeveloper.project})
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 p-2 rounded-lg ${
                        msg.sender === "Tester" ? "bg-purple-700 text-white self-end" : "bg-gray-300 text-gray-800 self-start"
                      } max-w-xs`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t flex">
                  <TextField
                    label="Type your message"
                    variant="outlined"
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    className="ml-2"
                    onClick={sendMessage}
                  >
                    Send
                  </Button>
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

export default ChatRoom;

