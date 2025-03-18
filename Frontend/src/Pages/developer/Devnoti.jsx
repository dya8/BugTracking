import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); 
export default function DevNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // ✅ Load stored notifications from localStorage
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(storedNotifications);
  }, []);

  useEffect(() => {
    // ✅ Listen for new chat notifications
    socket.on("chatNotification", (notification) => {
      console.log("🔔 New Notification Received:", notification);
      setNotifications((prev) => {
        const updated = [...prev, notification];
        localStorage.setItem("notifications", JSON.stringify(updated)); // ✅ Store in localStorage
        return updated;
      });
    });

    return () => {
      socket.off("chatNotification");
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex justify-between items-center p-4 bg-white shadow-md">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-2 py-1 border rounded-md"
              />
            </div>
          </div>

          {/* Notifications and User */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <FaBell
                className="text-purple-700 cursor-pointer"
                onClick={() => navigate("/devnotifications")}
              />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                  {notifications.length}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-purple-700 cursor-pointer">
              <span>Developer</span>
              <FaUser className="text-purple-700" />
            </div>
          </div>
        </div>

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
