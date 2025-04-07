import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const ManageUsers = ({ managerId }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;
  const manager = Number(managerId);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const changePage = (pageNum) => setCurrentPage(pageNum);

  useEffect(() => {
    if (!manager) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/project-users/${manager}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [manager]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-purple-700"> Manage Users</h2>
            <div className="relative">
              <input type="text" placeholder="Search" className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none" />
              <FaSearch className="absolute left-2 top-3 text-gray-500" />
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow p-4">
            {loading ? (
              <p className="text-gray-600">Loading users...</p>
            ) : error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : (
              <>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-purple-200 text-purple-800">
                      <th className="p-3">User Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Project</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      paginatedUsers.map((user, index) => (
                        <UserRow key={index} user={user} />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center p-3">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => changePage(index + 1)}
                          className={`px-3 py-1 rounded ${
                            currentPage === index + 1
                              ? "bg-purple-700 text-white"
                              : "text-purple-700 bg-white border border-purple-300"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserRow = ({ user }) => {
  return (
    <tr className="border-t text-gray-700">
      <td className="p-3">{user.name}</td>
      <td className="p-3 text-purple-600 font-medium">{user.role}</td>
      <td className="p-3">{user.project_name || "N/A"}</td>
    </tr>
  );
};

export default ManageUsers;
