import React from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
const AssignedBugs = () => {
  const navigate = useNavigate();

  const bugs = [
    {
      id: 1,
      name: "UI Button not clickable",
      project: "Project Alpha",
      status: "Open",
      assignedBy: "John Doe",
      priority: "High",
      due: "In 2 hrs",
    },
    {
      id: 2,
      name: "Login API failing",
      project: "Project Beta",
      status: "In Progress",
      assignedBy: "Jane Smith",
      priority: "Medium",
      due: "Tomorrow",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-purple-700">❗ Assigned Bugs</h2>
            <div className="relative">
              <input type="text" placeholder="Search" className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none" />
              <FaSearch className="absolute left-2 top-3 text-gray-500" />
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-200 text-purple-800">
                  <th className="p-3">Bug name</th>
                  <th className="p-3">Project name</th>
                  <th className="p-3">Bug status</th>
                  <th className="p-3">Assigned by</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Due</th>
                </tr>
              </thead>
              <tbody>
                {bugs.map((bug) => (
                  <tr key={bug.id} className="border-t text-gray-700">
                    <td className="p-3">{bug.name}</td>
                    <td className="p-3">{bug.project}</td>
                    <td className="p-3 text-purple-600 font-semibold">{bug.status}</td>
                    <td className="p-3">{bug.assignedBy}</td>
                    <td className="p-3">{bug.priority}</td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate(`/bug-details/${bug.id}`)}
                        className="text-purple-700 font-semibold hover:underline flex items-center"
                      >
                        {bug.due} ➜
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedBugs;
