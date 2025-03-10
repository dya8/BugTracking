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

        {/* Add Project Button */}
        <button
          className="flex item center space-x-2 px-4 py-2 border-[2px] border-purple-500 border-solid text-purple-500 bg-transparent rounded-md hover:bg-purple-100"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> <span>Add project</span>
        </button>

        {/* Notifications and User */}
        <FaBell
          className="text-purple-700 cursor-pointer"
          onClick={() => navigate("/notifications")} // Redirect on click
        />
        <div className="flex items-center space-x-2 text-purple-700 cursor-pointer">
          <span>Admin</span>
          <FaUser className="text-purple-700" />
        </div>
      </div>
    </div>
  );
}
