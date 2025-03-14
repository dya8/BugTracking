import React, { useState } from "react";
import { FaSearch, FaUser, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const ManageTeam = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "User 1", role: "Developer", selected: false },
    { id: 2, name: "User 2", role: "Designer", selected: false },
    { id: 3, name: "User 3", role: "Manager", selected: false },
    { id: 4, name: "User 4", role: "QA Tester", selected: false },
    { id: 5, name: "User 5", role: "Product Owner", selected: false },
    { id: 6, name: "User 6", role: "Backend Engineer", selected: false },
  ]);

  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setUsers(users.map(user => ({ ...user, selected: newSelectAll })));
  };

  const toggleUserSelection = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, selected: !user.selected } : user));
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <Navbar />
        <div className="p-6">
          <h2 className="text-xl font-bold text-purple-700 flex items-center">
            <span className="text-lg mr-2">ℹ</span> Manage Team
          </h2>
          <div className="flex justify-between items-center my-4">
            <p className="text-gray-700 text-lg">
              All users <span className="font-bold text-purple-600">{users.length}</span>
            </p>
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg w-1/3">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="ml-2 bg-transparent outline-none w-full text-gray-700"
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-100 text-gray-700">
                  <th className="px-4 py-2 text-left">
                    <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                  </th>
                  <th className="px-4 py-2 text-left">User Name</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">
                      <input 
                        type="checkbox" 
                        checked={user.selected} 
                        onChange={() => toggleUserSelection(user.id)} 
                      />
                    </td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2 flex justify-center space-x-3 text-purple-600">
                      <FaUser className="cursor-pointer hover:text-purple-800" title="View Profile" />
                      <FaEdit className="cursor-pointer hover:text-purple-800" title="Edit" />
                      <FaTrash className="cursor-pointer hover:text-red-500" title="Delete" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4 space-x-2 text-purple-600">
            <span className="cursor-pointer bg-purple-200 px-3 py-1 rounded">1</span>
            <span className="cursor-pointer hover:underline">2</span>
            <span className="cursor-pointer hover:underline">3</span>
            <span className="cursor-pointer hover:underline">4</span>
            <span className="cursor-pointer hover:underline">5</span>
            <span className="cursor-pointer hover:underline">6</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTeam;
