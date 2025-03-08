import { FaTachometerAlt, FaProjectDiagram, FaBug, FaCheckCircle, FaClipboardList, FaComments, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`bg-purple-700 text-white h-screen flex flex-col transition-all ${isOpen ? "w-64" : "w-20"} p-5`}>
      {/* Toggle Button */}
      <button className="mb-4 bg-purple-700 text-white focus:outline-none hover:bg-transparent" onClick={() => setIsOpen(!isOpen)}>
        <FaBars size={20} />
      </button>

      {/* Menu Title */}
      <h2 className={`text-xl font-bold mb-4 ${!isOpen && "hidden"}`}>Menu</h2>

      {/* Navigation Links */}
      <nav className="space-y-4 flex-1">
        <Link to="/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white hover:bg-purple-500">
          <FaTachometerAlt /> {isOpen && <span>Dashboard</span>}
        </Link>
        <Link to="/projects" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white hover:bg-purple-500">
          <FaProjectDiagram /> {isOpen && <span>Current Projects</span>}
        </Link>
        <Link to="/report-bug" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white hover:bg-purple-500">
          <FaBug /> {isOpen && <span>Report a Bug</span>}
        </Link>
        <Link to="/verify-bugs" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white hover:bg-purple-500">
          <FaCheckCircle /> {isOpen && <span>Verify Bugs</span>}
        </Link>
        <Link to="/reported-bugs" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white hover:bg-purple-500">
          <FaClipboardList /> {isOpen && <span>Reported Bugs</span>}
        </Link>
        <Link to="/chat-room" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white hover:bg-purple-500">
          <FaComments /> {isOpen && <span>Chat Room</span>}
        </Link>
      </nav>

      {/* Footer Links */}
      <div className="space-y-2">
        <Link to="/tester-settings" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white">
          <FaCog /> {isOpen && <span>Settings</span>}
        </Link>
        <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white">
          <FaSignOutAlt /> {isOpen && <span>Log Out</span>}
        </Link>
      </div>
    </aside>
  );
}
