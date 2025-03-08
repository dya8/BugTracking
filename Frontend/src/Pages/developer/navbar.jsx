import { FaSearch, FaBell, FaUser } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <form className="relative">
          <FaSearch className="absolute left-2 top-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-2 py-1 border rounded-md"
          />
        </form>

        {/* Notifications and User */}
        <FaBell className="text-purple-700 cursor-pointer" />
        <div className="flex items-center space-x-1 text-purple-700 cursor-pointer">
          <span>Developer</span>
          <FaUser className="text-purple-700" />
        </div>
      </div>
    </div>
  );
}
