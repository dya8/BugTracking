import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUsers, FaFolderOpen, FaBug, FaExclamationTriangle, 
  FaClock, FaCog, FaSignOutAlt, FaBars, FaTachometerAlt 
} from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/login"); // Redirect after confirming logout
  };

  return (
    <>
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
          <SidebarItem to="/managerdashboard" icon={<FaTachometerAlt size={18} />} label="Dashboard" isOpen={isOpen} />
          <SidebarItem to="/manage-team" icon={<FaUsers size={18} />} label="Manage Team" isOpen={isOpen} />
          <SidebarItem to="/current-projects" icon={<FaFolderOpen size={18} />} label="Current Projects" isOpen={isOpen} />
          <SidebarItem to="/trackbugs" icon={<FaBug size={18} />} label="Track Bugs" isOpen={isOpen} />
          <SidebarItem to="/reported-bugss" icon={<FaExclamationTriangle size={18} />} label="Reported Bugs" isOpen={isOpen} />
          <SidebarItem to="/assign-due" icon={<FaClock size={18} />} label="Assign Due" isOpen={isOpen} />
        </nav>

        {/* Footer Items */}
        <div className="space-y-3">
          <SidebarItem to="/settings" icon={<FaCog size={18} />} label="Settings" isOpen={isOpen} />
          
          {/* Logout Button with Modal */}
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition w-full text-left"
          >
            <FaSignOutAlt size={18} />
            {isOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <p className="text-lg font-semibold text-purple-700">Are you sure you want to log out?</p>
            <div className="flex justify-between mt-4">
              <button 
                onClick={() => setShowLogoutModal(false)} 
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SidebarItem({ to, icon, label, isOpen }) {
  return (
    <Link to={to} className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition">
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  );
}
