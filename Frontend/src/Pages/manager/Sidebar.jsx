import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaFolderOpen, FaBug, FaExclamationTriangle, FaClock, FaCog, FaSignOutAlt, FaBars, FaTachometerAlt } from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`bg-purple-700 text-white p-5 h-screen flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
      {/* Toggle Button */}
      <button 
        className="mb-4 flex items-center space-x-2 bg-transparent text-white focus:outline-none hover:bg-purple-600 p-2 rounded-lg" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={20} className="text-white" />
        {isOpen && <span className="text-lg font-semibold">Menu</span>}
      </button>

      {/* Menu Items */}
      <nav className="space-y-4 flex-1">
        <SidebarItem to="/managerdashboard" icon={<FaTachometerAlt size={18} className="text-white" />} label="Dashboard" isOpen={isOpen} />
        <SidebarItem to="/manage-team" icon={<FaUsers size={18} className="text-white" />} label="Manage Team" isOpen={isOpen} />
        <SidebarItem to="/current-projects" icon={<FaFolderOpen size={18} className="text-white" />} label="Current Projects" isOpen={isOpen} />
        <SidebarItem to="/trackbugs" icon={<FaBug size={18} className="text-white" />} label="Track Bugs" isOpen={isOpen} />
        <SidebarItem to="/reported-bugs" icon={<FaExclamationTriangle size={18} className="text-white" />} label="Reported Bugs" isOpen={isOpen} />
        <SidebarItem to="/assign-due" icon={<FaClock size={18} className="text-white" />} label="Assign Due" isOpen={isOpen} />
      </nav>

      {/* Footer Items */}
      <div className="space-y-3">
        <SidebarItem to="/settings" icon={<FaCog size={18} className="text-white" />} label="Settings" isOpen={isOpen} />
        <SidebarItem to="/logout" icon={<FaSignOutAlt size={18} className="text-white" />} label="Log Out" isOpen={isOpen} />
      </div>
    </aside>
  );
}

function SidebarItem({ to, icon, label, isOpen }) {
  return (
    <Link to={to} className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition">
      {icon}
      {isOpen && <span className="text-white">{label}</span>}
    </Link>
  );
}