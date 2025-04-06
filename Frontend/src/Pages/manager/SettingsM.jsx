import { useState, useEffect } from "react";
import { FaUser, FaEdit, FaBell, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar"; // Use Manager Sidebar

// Reusable PasswordInput component
function PasswordInput({ value, onChange, placeholder = "Enter password" }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border p-2 w-full rounded-md pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-2 top-2 text-gray-600"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}

export default function SettingsM({ managerId }) {
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const manId = Number(managerId);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/Managers/${manId}`);
        const data = await response.json();
        console.log(data);
        // Check if the response is ok and data is not empty
        if (response.ok) {
          setManager(data);
        } else {
          console.error("Failed to fetch manager data", data);
        }
      } catch (error) {
        console.error("Error fetching manager details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [manId]);

  useEffect(() => {
    if (manager) {
      setEmail(manager.email || "");
      setPassword(""); // Don't pre-fill password
    }
  }, [manager]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/Manager/${manId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Profile updated successfully");
          // 🔁 Update the manager state to reflect changes
      setManager((prevManager) => ({
        ...prevManager,
        email,
        password, // NOTE: showing raw password is for dev/testing; consider hiding this in production
      }));
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
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-purple-700 flex items-center">
              <FaUser className="mr-2" /> Manager Settings
            </h2>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 flex items-center">
                My Profile <FaUser className="ml-2 text-purple-500" />
              </h3>
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                {loading ? (
                  <p>Loading...</p>
                ) : manager ? (
                  <>
                    <p><strong>Name:</strong> {manager.name}</p>
                    <p><strong>Role:</strong> {manager.role}</p>
                    <p><strong>Company Name:</strong> {manager.companyName}</p>
                    <p><strong>Company Email:</strong> {manager.companyEmail}</p>

                    {editMode ? (
                      <>
                        <p className="mt-2"><strong>Email:</strong></p>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border p-2 w-full rounded-md"
                        />

                        <p className="mt-2"><strong>Change Password:</strong></p>
                        <PasswordInput
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                        <p><strong>Email:</strong> {manager.email}</p>
                        <p><strong>Password:</strong> {manager.password}</p>
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
                  <p className="text-red-500">Manager details not found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
