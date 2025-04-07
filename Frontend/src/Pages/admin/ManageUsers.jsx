import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import Sidebar from "./Sidebar"; 
import { FaSearch, FaBell, FaUser } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";  // ✅ Import useNavigate

export default function ManageUsers({adminId}) {
  const [users, setUsers] = useState([{ email: "", role: "" }]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const adId = Number(adminId); // Example admin ID
  const [currentPage, setCurrentPage] = useState(1);
const usersPerPage = 4;

const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = fetchedUsers.slice(indexOfFirstUser, indexOfLastUser);
const totalPages = Math.ceil(fetchedUsers.length / usersPerPage);


  const navigate = useNavigate(); // ✅ Initialize navigate
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        console.log("Admin ID:", adId);
        const response = await fetch(`http://localhost:3000/api/users/${adId}`);
        const data = await response.json();
  
        console.log("Fetched Data:", data); // Debugging line
  
        if (response.ok) {
          // Ensure it's an array before setting state
          if (Array.isArray(data)) {
              // Modify API response to store the user ID without displaying it
              const formattedUsers = data.map(user => ({
                id: user.developer_id || user.tester_id || user.manager_id, // Store ID
                name: user.name, // Display name only
                role: user.role, // Display role
              }));
            setFetchedUsers(data);
          } else {
            console.error("Expected an array but got:", data);
            setFetchedUsers([]); // Prevents .map() error
          }
        } else {
          console.error("API Error:", data.message);
          setFetchedUsers([]); // Set empty array to prevent crash
        }
      } catch (error) {
        console.error("Network Error:", error);
        setFetchedUsers([]); // Handle network failures
      } finally {
        setLoading(false);
      }
    };
  
    if (adId) fetchUsers(); // Only fetch if adminId is valid
  }, [adId]);

const handleDeleteUser = async (user) => {
  console.log("Full User Object:", user);

  // Ensure the correct ID is retrieved based on the role
  let userId;
  if (user.role === "Developer") userId = user.id || user.developer_id;
  else if (user.role === "Tester") userId = user.id || user.tester_id;
  else if (user.role === "Project Manager") userId = user.id || user.manager_id;
  else {
      alert("Invalid role detected.");
      return;
  }

  console.log("Extracted userId:", userId);  // Debugging


  if (!userId || isNaN(Number(userId))) {
      alert("Invalid user ID received.");
      return;
  }

  const confirmDelete = window.confirm(`Are you sure you want to delete ${user.name}?`);
  if (!confirmDelete) return;

  try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}?role=${user.role}`, {
          method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
          alert(data.message);
          setFetchedUsers(fetchedUsers.filter(u => u.id !== userId));
      } else {
          alert("Failed to delete user: " + data.message);
      }
  } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
  }
};

  
  const handleInputChange = (index, field, value) => {
    const newUsers = [...users];
    newUsers[index][field] = value;
    setUsers(newUsers);
  };

  const addUserField = () => {
    setUsers([...users, { email: "", role: "" }]);
  };

  const removeUserField = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const confirmUsers = () => {
    const validUsers = users.filter(user => user.email && user.role);
    if (validUsers.length > 0) {
      setAddedUsers([...addedUsers, ...validUsers]);
    }
    setUsers([{ email: "", role: "" }]);
    setShowPopup(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        
        {/* Navbar */}
        <div className="flex justify-between items-center p-4 bg-white shadow-md">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-2 py-1 border rounded-md"
              />
            </div>

            {/* Notifications and User */}
            <FaBell 
              className="text-purple-700 cursor-pointer" 
              onClick={() => navigate("/notifications")} // ✅ Fix: Navigate on click
            />
            <div className="flex items-center space-x-2 text-purple-700 cursor-pointer">
              <span>Admin</span>
              <FaUser className="text-purple-700" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <header className="flex justify-between items-center bg-white p-3 shadow-md rounded-lg">
            <h2 className="text-lg font-semibold">Manage Users</h2>
            <button
              className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-md"
              onClick={() => setShowPopup(true)}
            >
              Add user <Plus className="w-4 h-4" />
            </button>
          </header>
           {/* Fetched Users from API */}
          <div className="mt-5 bg-white p-4 shadow rounded-lg">
  <h2 className="text-lg font-semibold mb-3">Company Users</h2>
  {loading ? (
    <p className="text-gray-500">Loading users...</p>
  ) : fetchedUsers.length === 0 ? (
    <p className="text-gray-500">No users found.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-purple-200">
          <tr>
            <th className="p-3 border">User Name</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody> 
        {Array.isArray(currentUsers) && currentUsers.length > 0 ? (
  currentUsers.map((user, index) => (
    <tr key={index} className="border-b hover:bg-gray-100">
      <td className="p-3 border">{user.name}</td>
      <td className="p-3 border">{user.role}</td>
      <td className="p-3 border flex gap-2 justify-center">
      <button 
  className="text-purple-600 hover:text-purple-800"
  onClick={() => navigate(`/view-user/${user.id}/${user.role}`)}
>
  👤
</button>

        <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteUser(user)}>❌</button>
      </td>
    </tr>
  ))
) : (
  <p className="text-gray-500">{currentUsers.length === 0 ? "No users found." : "Error fetching users."}</p>
)}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
    </div>
  )}
</div>
        </div>

        {/* Add Users Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-[400px] shadow-lg rounded-xl bg-white">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold mb-4">Add Users</h2>
                <p className="text-sm text-gray-600 mb-3">Invite by mail</p>
                {users.map((user, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <Input
                      type="email"
                      placeholder="Enter email"
                      value={user.email}
                      onChange={(e) => handleInputChange(index, "email", e.target.value)}
                      className="flex-1"
                    />
                    <select
                      value={user.role}
                      onChange={(e) => handleInputChange(index, "role", e.target.value)}
                      className="flex-1 border rounded px-2 py-1 bg-white"
                    >
                      <option value="">Select Role</option>
                      <option value="Developer">Developer</option>
                      <option value="Tester">Tester</option>
                      <option value="Manager">Project Manager</option>
                    </select>
                    <button onClick={() => removeUserField(index)} className="text-red-500">
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mb-3" onClick={addUserField}>
                  <Plus className="w-4 h-4 mr-1" /> Add another
                </Button>
                <div className="flex justify-between">
                  <Button className="bg-red-500 text-white hover:bg-red-500" onClick={() => setShowPopup(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={confirmUsers}>
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}