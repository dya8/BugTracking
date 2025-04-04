import { FaCog, FaSignOutAlt, FaTachometerAlt, FaUsers, FaProjectDiagram, FaBars } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import navigation

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/"); // Redirect to login or home page after logout
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`bg-purple-700 text-white p-5 h-screen flex flex-col transition-all ${isOpen ? "w-64" : "w-20"}`}>
        {/* Toggle Button */}
        <button className="mb-4 bg-purple-700 text-white focus:outline-none hover:bg-transparent" onClick={() => setIsOpen(!isOpen)}>
          <FaBars size={20} />
        </button>

        {/* Menu Items */}
        <nav className="space-y-4 flex-1">
          <Link to="/admindashboard" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-purple-500">
            <FaTachometerAlt /> {isOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/admin" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-purple-500">
            <FaUsers /> {isOpen && <span>Manage Users</span>}
          </Link>
          <Link to="/test" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-purple-500">
            <FaProjectDiagram /> {isOpen && <span>Current Projects</span>}
          </Link>
        </nav>

        {/* Footer Items */}
        <div className="space-y-2">
          <Link to="/settings" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:text-white">
            <FaCog /> {isOpen && <span>Settings</span>}
          </Link>
          
          {/* Logout Button that triggers modal */}
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:text-white w-full text-left"
          >
            <FaSignOutAlt /> {isOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <p className="text-lg font-semibold text-purple-700">Are you sure you want to log out?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button 
                onClick={() => setShowLogoutModal(false)} 
                className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
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
