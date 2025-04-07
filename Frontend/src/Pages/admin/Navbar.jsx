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
    setHasNotification(false);
    navigate("/devnotifications");
  };

  // Handle click on Developer info
  const handleUserClick = () => {
    navigate("/setting"); // Adjust the route as per your route setup
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Left section (can add logo or search bar here later) */}
      <div className="flex items-center">
        {/* Optional content on the left */}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div
          className="flex items-center text-purple-700 cursor-pointer gap-2"
          onClick={handleUserClick}
        >
          <span>Admin</span>
          <FaUser className="text-purple-700" />
        </div>
      </div>
    </div>
  );
}
