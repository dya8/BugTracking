import React, { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const Chatroom = () => {
  const [selectedTester, setSelectedTester] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const testers = [
    { id: 1, name: "Tester 1", project: "Project Alpha" },
    { id: 2, name: "Tester 2", project: "Project Beta" },
  ];

  const handleSelectTester = (tester) => {
    setSelectedTester(tester);
    setMessages([]); // Fetch chat history later
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const newMsg = { sender: "Developer", text: newMessage };
    setMessages([...messages, newMsg]);
    setNewMessage("");
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
                key={tester.id}
                className={`p-3 mt-2 rounded-lg cursor-pointer font-semibold text-purple-700 border ${
                  selectedTester?.id === tester.id ? "bg-purple-200" : "hover:bg-purple-100"
                }`}
                onClick={() => handleSelectTester(tester)}
              >
                {tester.name} ({tester.project})
              </div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedTester ? (
              <>
                <div className="bg-gray-200 p-4 font-semibold text-purple-700 text-lg border-b">
                  {selectedTester.name} ({selectedTester.project})
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 rounded-lg ${
                      msg.sender === "Developer" ? "bg-purple-700 text-white self-end" : "bg-gray-300 text-gray-800 self-start"
                    } max-w-xs`}
                    >
                      {msg.text}
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
