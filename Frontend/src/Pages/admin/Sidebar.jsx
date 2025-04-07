import { FaCog, FaSignOutAlt, FaTachometerAlt, FaUsers, FaProjectDiagram, FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    // Retrieve userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setAdminId(storedUserId); // ✅ Fixed function call
    }
  }, []);

  return (
    <aside className={`bg-purple-700 text-white p-5 h-screen flex flex-col transition-all ${isOpen ? "w-64" : "w-20"}`}>
      {/* Toggle Button */}
      <button className="mb-4 bg-purple-700 text-white focus:outline-none hover:bg-transparent" onClick={() => setIsOpen(!isOpen)}>
        <FaBars size={20} />
      </button>

      {/* Menu Items */}
      <nav className="space-y-4 flex-1">
        <Link key="dashboard" to={adminId ? `/admindashboard/${adminId}` : "/login"} className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:bg-purple-500">
          <FaTachometerAlt /> {isOpen && <span>Dashboard</span>}
        </Link>
        <Link key="manageUsers" to="/admin" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:bg-purple-500">
          <FaUsers /> {isOpen && <span>Manage Users</span>}
        </Link>
        <Link key="projects" to="/test" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:bg-purple-500">
          <FaProjectDiagram /> {isOpen && <span>Current Projects</span>}
        </Link>
      </nav>

      {/* Footer Items */}
      <div className="space-y-2">
        <Link key="settings" to="/setting" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white">
          <FaCog /> {isOpen && <span>Settings</span>}
        </Link>
        <Link key="logout" to="/logout" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:text-white">
          <FaSignOutAlt /> {isOpen && <span>Log Out</span>}
        </Link>
      </div>
    </aside>
  );
}
