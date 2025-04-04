import { useState, useEffect } from "react";
import { FaUser, FaEdit, FaBell } from "react-icons/fa";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Settings() {
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const developerId = 1; // Replace with dynamic developer ID if needed

  useEffect(() => {
    const fetchDeveloperData = async () => {
      try {
        console.log("Fetching details for developer ID:", developerId);

        const response = await fetch(`http://localhost:3000/api/developer/${developerId}`);
        const data = await response.json();

        if (response.ok) {
          setDeveloper(data);
        } else {
          console.error("Failed to fetch developer data", data);
        }
      } catch (error) {
        console.error("Error fetching developer details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperData();
  }, [developerId]);
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/developer/${developerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Profile updated successfully");
        setEditMode(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

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
                {loading ? (
                  <p>Loading...</p>
                ) : developer ? (
                  <>
                    <p><strong>Name:</strong> {developer.name}</p>
                    <p><strong>Role:</strong> {developer.role}</p>
                    <p><strong>Email:</strong> {developer.email}</p>
                    <p><strong>Company Name:</strong> {developer.companyName}</p>
                    <p><strong>Company Email:</strong> {developer.companyEmail}</p>
                    {editMode ? (
                      <>
                        <p><strong>Email:</strong></p>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border p-2 w-full rounded-md"
                        />

                        <p className="mt-2"><strong>Change Password:</strong></p>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="border p-2 w-full rounded-md"
                          placeholder="Enter new password"
                        />

                        <button
                          onClick={handleSave}
                          className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center"
                        >
                          <FaSave className="mr-2" /> Save
                        </button>
                      </>
                    ) : (
                      <>
                        <p><strong>Email:</strong> {developer.email}</p>
                        <p><strong>Change Password:</strong> ********</p>
                        <button
                          onClick={() => setEditMode(true)}
                          className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-red-500">Developer details not found</p>
                )}
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