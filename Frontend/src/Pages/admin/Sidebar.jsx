import { FaCog, FaSignOutAlt, FaTachometerAlt, FaUsers, FaProjectDiagram, FaBars } from "react-icons/fa";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`bg-purple-700 text-white p-5 h-screen flex flex-col transition-all ${isOpen ? "w-64" : "w-20"}`}>
      {/* Toggle Button */}
      <button className="mb-4 bg-purple-700 text-white focus:outline-none hover:bg-transparent" onClick={() => setIsOpen(!isOpen)}>
        <FaBars size={20} />
      </button>

      {/* Menu Items */}
      <nav className="space-y-4 flex-1">
        <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white hover:bg-purple-500">
          <FaTachometerAlt /> {isOpen && <span>Dashboard</span>}
        </a>
        <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white hover:bg-purple-500">
          <FaUsers /> {isOpen && <span>Manage users</span>}
        </a>
        <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white hover:bg-purple-500">
          <FaProjectDiagram /> {isOpen && <span>Current projects</span>}
        </a>
      </nav>

      {/* Footer Items */}
      <div className="space-y-2">
        <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white">
          <FaCog /> {isOpen && <span>Settings</span>}
        </a>
        <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white">
          <FaSignOutAlt /> {isOpen && <span>Log out</span>}
        </a>
      </div>
    </aside>
  );
}
