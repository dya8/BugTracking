import { FaSearch, FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Navbar() {
  const navigate = useNavigate();
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3000"); 

    // Listen for new chat message notifications
    socket.on("newMessage", () => {
      setHasNotification(true);
    });

    return () => socket.disconnect(); // Cleanup on unmount
  }, []);

  // Handle click on notification bell
  const handleNotificationClick = () => {
    setHasNotification(false); // Remove red dot
    navigate("/devnotifications"); // Redirect to notifications page
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <form className="relative">
          <FaSearch className="absolute left-2 top-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-2 py-1 border rounded-md"
          />
        </form>

        {/* Notifications with Red Dot */}
        <div className="relative cursor-pointer" onClick={handleNotificationClick}>
          <FaBell className="text-purple-700" />
          {hasNotification && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-1 text-purple-700 cursor-pointer">
          <span>Developer</span>
          <FaUser className="text-purple-700" />
        </div>
      </div>
    </div>
  );
}

