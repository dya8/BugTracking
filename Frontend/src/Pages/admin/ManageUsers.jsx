import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import Sidebar from "./Sidebar";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function ManageUsers({ adminId }) {
  const [users, setUsers] = useState([{ name: "", email: "", role: "" }]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const adId = Number(adminId);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = fetchedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(fetchedUsers.length / usersPerPage);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/users/${adId}`);
        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data)) {
            const formattedUsers = data.map(user => ({
              id: user.developer_id || user.tester_id || user.manager_id,
              name: user.name,
              role: user.role,
            }));
            setFetchedUsers(formattedUsers);
          } else {
            console.error("Expected an array but got:", data);
            setFetchedUsers([]);
          }
        } else {
          console.error("API Error:", data.message);
          setFetchedUsers([]);
        }
      } catch (error) {
        console.error("Network Error:", error);
        setFetchedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (adId) fetchUsers();
  }, [adId]);

  const handleDeleteUser = async (user) => {
    let userId = user.id;

    if (!userId || isNaN(userId)) {
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
        const updatedUsers = fetchedUsers.filter(u => u.id !== userId);
        setFetchedUsers(updatedUsers);

        if ((currentPage - 1) * usersPerPage >= updatedUsers.length && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
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
    setUsers([...users, { name: "", email: "", role: "" }]);
  };

  const removeUserField = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const confirmUsers = async () => {
    const validUsers = users.filter(user => user.name && user.email && user.role);
    if (validUsers.length === 0) return;
  
    try {
      for (let user of validUsers) {
        const response = await fetch("http://localhost:3000/add-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            role: user.role.toLowerCase(), // lowercase to match backend logic
            admin_id: adId, // ✅ correctly pass admin ID as expected by backend
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          alert("Failed to invite user: " + data.message);
        }
      }
  
      alert("All users invited successfully.");
      setAddedUsers(prev => [...prev, ...validUsers]);
      setUsers([{ name: "", email: "", role: "" }]);
      setShowPopup(false);
  
      // Refresh fetched users
      const refreshUsers = await fetch(`http://localhost:3000/api/users/${adId}`);
      const freshData = await refreshUsers.json();
      const formattedUsers = freshData.map(user => ({
        id: user.developer_id || user.tester_id || user.manager_id,
        name: user.name,
        role: user.role,
      }));
      setFetchedUsers(formattedUsers);
  
    } catch (error) {
      console.error("Error inviting users:", error);
      alert("An error occurred while inviting users.");
    }
  };
  

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-100">
       <Navbar />
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
                    {currentUsers.map((user, index) => (
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
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteUser(user)}
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-center mt-4 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
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
            <Card className="w-[500px] shadow-lg rounded-xl bg-white">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold mb-4">Add Users</h2>
                <p className="text-sm text-gray-600 mb-3">Invite by name, email, and role</p>
                {users.map((user, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <Input
                      type="text"
                      placeholder="Name"
                      value={user.name}
                      onChange={(e) => handleInputChange(index, "name", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
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
                      <option value="Project Manager">Project Manager</option>
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
                  <Button
                    className="bg-purple-600 text-white hover:bg-purple-700"
                    onClick={confirmUsers}
                    disabled={users.every(user => !user.name || !user.email || !user.role)}
                  >
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
