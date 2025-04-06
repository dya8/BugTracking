import { useState, useEffect } from "react";
import { FaUser, FaEdit, FaBell, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

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

export default function Settings({userId}) {
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const devid = Number(userId);
  //const developerId = 1; // Replace with dynamic developer ID if needed

  useEffect(() => {
    const fetchDeveloperData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/developer/${devid}`);
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
  }, [devid]);

  useEffect(() => {
    if (developer) {
      setEmail(developer.email || "");
      setPassword(""); // Don't pre-fill password
    }
  }, [developer]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/developer/${devid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Profile updated successfully");
          // 🔁 Update the manager state to reflect changes
      setDeveloper((prevDeveloper) => ({
        ...prevDeveloper,
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
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-purple-700 flex items-center">
              <FaUser className="mr-2" /> Settings
            </h2>

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
                    <p><strong>Company Name:</strong> {developer.companyName}</p>
                    <p><strong>Company Email:</strong> {developer.companyEmail}</p>

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
                        <p><strong>Email:</strong> {developer.email}</p>
                        <p><strong>Password:</strong>{developer.password}</p>
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

        
          </div>
        </div>
      </div>
    </div>
  );
}
