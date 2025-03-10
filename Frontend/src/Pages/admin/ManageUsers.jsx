import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import Sidebar from "./Sidebar"; 
import { FaSearch, FaBell, FaUser } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";  // ✅ Import useNavigate

export default function ManageUsers() {
  const [users, setUsers] = useState([{ email: "", role: "" }]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate(); // ✅ Initialize navigate

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

          {/* Display Added Users */}
          <div className="mt-5 bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Users</h2>
            {addedUsers.length === 0 ? (
              <p className="text-gray-500">No users added yet.</p>
            ) : (
              <ul>
                {addedUsers.map((user, index) => (
                  <li key={index} className="border-b py-2 flex justify-between">
                    <span>{user.email} - {user.role}</span>
                  </li>
                ))}
              </ul>
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
