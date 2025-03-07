import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, UserPlus, Menu, Search, Settings, LogOut, Trash } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([{ email: "", role: "" }]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (index, field, value) => {
    const newUsers = [...users];
    newUsers[index][field] = value;
    setUsers(newUsers);
  };

  const addUserField = () => {
    setUsers([...users, { email: "", role: "" }]);
  };

  const removeUserField = (index) => {
    const newUsers = users.filter((_, i) => i !== index);
    setUsers(newUsers);
  };

  const sendEmail = async (user) => {
    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Email sent successfully!");
        setAddedUsers((prev) => [...prev, user]); // Add user to displayed list
      } else {
        alert("Error sending email: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-700 text-white p-5 flex flex-col">
        <div className="flex items-center gap-2 text-xl font-semibold mb-8">
          <Menu className="w-6 h-6" /> Menu
        </div>
        <nav className="flex flex-col space-y-4">
          <button className="flex items-center gap-2 text-white text-lg bg-purple-700 ">
            <UserPlus className="w-5 h-5 " /> Manage Users
          </button>
          <button className="flex items-center gap-2 text-white text-lg bg-purple-700">Current Projects</button>
        </nav>
        <div className="mt-auto">
          <button className="flex items-center gap-2 text-white text-lg mb-3 bg-purple-700">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button className="flex items-center gap-2 text-white text-lg bg-purple-700">
            <LogOut className="w-5 h-5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-5 bg-gray-100">
        <header className="flex justify-between items-center bg-white p-3 shadow-md rounded-lg">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Search" className="outline-none" />
          </div>
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
                  <Button
                    className="bg-purple-600 text-white hover:bg-purple-700"
                    onClick={() => {
                      users.forEach((user) => sendEmail(user)); // Send email and add user to content
                      setShowPopup(false);
                    }}
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
