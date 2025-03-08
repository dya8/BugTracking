import React from "react";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg w-1/3">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="ml-2 bg-transparent outline-none w-full text-gray-700"
        />
      </div>

      {/* Notifications and User Profile */}
      <div className="flex items-center space-x-6">
        <FaBell className="text-purple-700 cursor-pointer text-xl" />
        <div className="flex items-center space-x-2 text-purple-700 cursor-pointer">
          <span className="font-semibold">Project Manager</span>
          <FaUser className="text-xl" />
        </div>
      </div>
    </div>
  );
}
