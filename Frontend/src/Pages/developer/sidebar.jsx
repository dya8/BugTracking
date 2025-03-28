import { FaCog, FaSignOutAlt, FaChartBar, FaFileAlt, FaBug, FaComments, FaBars } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom"; // For navigation

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`bg-purple-700 text-white p-5 h-screen h-full flex flex-col transition-all ${isOpen ? "w-64" : "w-20"}`}>
      {/* Toggle Button */}
      <button className="mb-4 flex items-center space-x-2 bg-transparent text-white focus:outline-none hover:bg-purple-600 p-2 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
        <FaBars size={20} className="text-white" />
        {isOpen && <span className="text-lg font-semibold text-white">Menu</span>}
      </button>

      {/* Menu Items */}
      <nav className="space-y-4 flex-1">
        <Link to="/devdashboard" className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition">
          <FaChartBar size={18} className="text-white" />
          {isOpen && <span className="text-white">Dashboard</span>}
        </Link>
        <Link to="/project" className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition">
          <FaFileAlt size={18} className="text-white" />
          {isOpen && <span className="text-white">Projects</span>}
        </Link>
        <Link to="/assigned-bugs" className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition">
          <FaBug size={18} className="text-white" />
          {isOpen && <span className="text-white">Assigned Bugs</span>}
        </Link>
        <Link to="/chatroom" className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition">
          <FaComments size={18} className="text-white" />
          {isOpen && <span className="text-white">Chat Room</span>}
        </Link>
      </nav>

      {/* Footer Items */}
      <div className="space-y-3">
        <Link to="/settings" className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition">
          <FaCog size={18} className="text-white" />
          {isOpen && <span className="text-white">Settings</span>}
        </Link>
        <Link to="/logout" className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition">
          <FaSignOutAlt size={18} className="text-white" />
          {isOpen && <span className="text-white">Log Out</span>}
        </Link>
      </div>
    </aside>
  );
}
