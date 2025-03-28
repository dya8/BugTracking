import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import socket from "../../socket";

export default function DevNotifications() {
  const navigate = useNavigate();
  const { chatroom_id } = useParams();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log("🔄 Trying to connect to socket...");
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("connect", () => {
        console.log("✅ Connected to WebSocket!");
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err);
    });
    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);
  useEffect(() => {
    if (chatroom_id) {
      socket.emit("joinChatroom", chatroom_id);
      console.log(`🟢 Joined chatroom_${chatroom_id}`);
    }
   
   /* const handleNewMessage = (notification) => {
      console.log("🔔 New Message Notification Received:", notification);
  
      const newNotif = {
        message: "You have a new message",
        chatroom_id: notification.chatroom_id,
        time: new Date().toLocaleTimeString(),
      };
  
      setNotifications((prev) => [...prev, newNotif]);
    };*/
    socket.on("newMessage", (notification) => {
      console.log("🔔 New Notification Received:", notification);

      setNotifications((prev) => [
        ...prev,
        { message: "New Message", chatroom_id: notification.chatroom_id, time: new Date().toLocaleTimeString() },
      ]);
    });

    return () => {
      console.log("ℹ️ Cleaning up listeners...");
      socket.off("newMessage");
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/*Navbar */}
        <Navbar notifications={notifications} />
        {/* Notifications Section */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Notifications</h2>

          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications</p>
          ) : (
            notifications.map((notif, index) => (
              <Card key={index} className="border border-purple-300 mb-2">
                <CardContent className="p-4 flex justify-between items-center">
                  <span className="text-lg">
                    <strong className="text-purple-700">{notif.message}</strong>{" "}
                    <span className="text-gray-500">{notif.time}</span>
                  </span>
                  <a
                    href={`/chat/${notif.chatroom_id}`}
                    className="text-purple-700 flex items-center"
                  >
                    Open <span className="ml-1">↗</span>
                  </a>
                </CardContent>
              </Card>
            ))
          )}

          {/* Clear All Button */}
          <div className="flex justify-center mt-6">
            <Button
              className="bg-purple-600 text-white px-6 py-2 rounded-lg"
              onClick={clearNotifications}
            >
              Clear all
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
