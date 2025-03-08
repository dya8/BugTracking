import { FaUser, FaEdit, FaBell } from "react-icons/fa";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Tester_Settings() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Settings Content */}
        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            {/* Settings Header */}
            <h2 className="text-2xl font-semibold text-purple-700 flex items-center">
              <FaUser className="mr-2" /> Settings
            </h2>

            {/* My Profile Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 flex items-center">
                My Profile <FaUser className="ml-2 text-purple-500" />
              </h3>
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Role:</strong> Manager</p>
                <p><strong>Email:</strong> john@example.com</p>
                <p><strong>Company Name:</strong> Tech Solutions</p>
                <p><strong>Company Email:</strong> contact@techsolutions.com</p>
                <p><strong>Change Password:</strong> ********</p>

                {/* Edit Button */}
                <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center">
                  <FaEdit className="mr-2" /> Edit
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 flex items-center">
                Notifications <FaBell className="ml-2 text-purple-500" />
              </h3>
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                <span>Enable Push Notifications</span>
                <input type="checkbox" className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
