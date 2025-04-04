import { FaCog, FaSignOutAlt, FaChartBar, FaFileAlt, FaBug, FaComments, FaBars, FaExclamationTriangle } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // For navigation

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/login"); // Redirect to login after confirming logout
  };

  return (
    <>
      <aside className={`bg-purple-700 text-white p-5 h-screen flex flex-col transition-all ${isOpen ? "w-64" : "w-20"}`}>
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
          <Link to="/reportedbugst" className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition">
            <FaExclamationTriangle size={18} className="text-white" />
            {isOpen && <span className="text-white">Reported Bugs</span>}
          </Link>
        </nav>

        {/* Footer Items */}
        <div className="space-y-3">
          <Link to="/settings" className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition">
            <FaCog size={18} className="text-white" />
            {isOpen && <span className="text-white">Settings</span>}
          </Link>

          {/* Logout Button */}
          <button onClick={() => setShowLogoutModal(true)} className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-purple-600 transition w-full text-left">
            <FaSignOutAlt size={18} className="text-white" />
            {isOpen && <span className="text-white">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <p className="text-lg font-semibold text-purple-700">Are you sure you want to log out?</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
                Cancel
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
