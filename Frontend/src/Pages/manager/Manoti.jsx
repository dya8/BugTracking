import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaUser } from "react-icons/fa"; // ✅ Fixed: Import Icons
import Sidebar from "./Sidebar";

export default function ManNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You have been assigned a new bug!", time: "Time" },
  ]);

  const clearNotifications = () => setNotifications([]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* ✅ Fixed: Navbar properly placed inside main content */}
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
            <FaBell
              className="text-purple-700 cursor-pointer"
              onClick={() => navigate("/manotifications")}
            />
            <div className="flex items-center space-x-2 text-purple-700 cursor-pointer">
              <span>Project Manager</span>
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
            <Card className="border border-purple-300">
              <CardContent className="p-4 flex justify-between items-center">
                <span className="text-lg">
                  <strong className="text-purple-700">You have been assigned a new bug!</strong>{" "}
                  <span className="text-gray-500">{notifications[0].time}</span>
                </span>
                <a href="#" className="text-purple-700 flex items-center">
                  Open <span className="ml-1">↗</span>
                </a>
              </CardContent>
            </Card>
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
