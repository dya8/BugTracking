import { FaUserTie, FaEdit, FaBell } from "react-icons/fa";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Projectmanagersettings() {
  const [manager, setManager] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    // Fetch manager details
    axios.get("/api/manager")
      .then(response => {
        setManager(response.data);
        return axios.get(`/api/company/${response.data.company_id}`);
      })
      .then(response => setCompany(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

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
            <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
              <FaUserTie className="mr-2" /> Project Manager Settings
            </h2>

            {/* Profile Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 flex items-center">
                Profile <FaUserTie className="ml-2 text-blue-500" />
              </h3>
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                {manager && company ? (
                  <>
                    <p><strong>Name:</strong> {manager.name}</p>
                    <p><strong>Role:</strong> Project Manager</p>
                    <p><strong>Email:</strong> {manager.email}</p>
                    <p><strong>Company Name:</strong> {company.name}</p>
                    <p><strong>Company Email:</strong> {company.email}</p>
                    <p><strong>Change Password:</strong> ********</p>

                    {/* Edit Button */}
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">
                      <FaEdit className="mr-2" /> Edit
                    </button>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>

            {/* Notifications Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 flex items-center">
                Notifications <FaBell className="ml-2 text-blue-500" />
              </h3>
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                <span>Enable Project Alerts</span>
                <input type="checkbox" className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
