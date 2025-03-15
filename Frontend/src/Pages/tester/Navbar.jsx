/**import React from "react";

const Navbar = () => (
  <div className="flex justify-between items-center p-4 shadow-md bg-white">
    <input type="text" placeholder="Search" className="p-2 border rounded" />
    <div className="flex items-center space-x-4">
      <span className="text-purple-700">🔔</span>
      <span className="text-purple-700">💬</span>
      <span className="font-bold">Tester</span>
      <span>👤</span>
    </div>
  </div>
);

export default Navbar;
**/
import { FaSearch, FaPlus, FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function Navbar({ setShowModal }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <FaSearch className="absolute left-2 top-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-2 py-1 border rounded-md"
          />
        </div>

        <span className="text-purple-700">💬</span>

        {/* Notifications and User */}
        <FaBell className="text-purple-700 cursor-pointer" 
        onClick={() => navigate("/testnotifications")}/>
        <div className="flex items-center space-x-2 text-purple-700 cursor-pointer">
          <span>Tester
          </span>
          <FaUser className="text-purple-700" />
        </div>
      </div>
    </div>
  );
}
