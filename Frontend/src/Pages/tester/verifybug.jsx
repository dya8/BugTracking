import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function VerifyBugs() {
  const [bugs] = useState([
    { id: 1, name: "Login Issue", project: "Website", assigned: "Dev A", status: "Resolved", priority: "High", due: "2024-03-15T10:00" },
    { id: 2, name: "Page Crash", project: "Mobile App", assigned: "Dev B", status: "Resolved", priority: "Medium", due: "2024-03-18T14:30" },
    { id: 3, name: "UI Glitch", project: "Dashboard", assigned: "Dev C", status: "Verified", priority: "Low", due: "2024-03-20T16:45" },
    { id: 4, name: "API Timeout", project: "Backend", assigned: "Dev D", status: "Reopen", priority: "High", due: "2024-03-22T09:15" }
  ]);

  const navigate = useNavigate();

  const handleArrowClick = (bugId) => {
    navigate(`/verify-bugs/${bugId}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <Navbar />
        <div className="p-6">
          <h1 className="text-xl font-bold text-purple-700">✔️ Verify bugs</h1>
          <p className="text-gray-600">Bugs to verify {bugs.length}</p>

          <div className="bg-white shadow-md rounded-lg mt-4">
            <table className="w-full text-left border-collapse">
              <thead className="bg-purple-200 text-purple-800">
                <tr>
                  <th className="p-3">Bug Name</th>
                  <th className="p-3">Project Name</th>
                  <th className="p-3">Assigned On</th>
                  <th className="p-3">Bug Status</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Due</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {bugs.length > 0 ? (
                  bugs.map((bug) => (
                    <tr key={bug.id} className="border-b hover:bg-gray-100">
                      <td className="p-3">{bug.name}</td>
                      <td className="p-3">{bug.project}</td>
                      <td className="p-3">{bug.assigned}</td>
                      <td className="p-3">{bug.status}</td>
                      <td className="p-3">{bug.priority}</td>
                      <td className="p-3">
                        {new Date(bug.due).toLocaleString()}
                      </td>
                      <td className="p-3 cursor-pointer">
                        <FaChevronRight
                          className="text-purple-600"
                          onClick={() => handleArrowClick(bug.id)} // Add onClick here
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-3">No bugs to verify</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-purple-700 text-white rounded">1</button>
              <button className="px-3 py-1 text-purple-700">2</button>
              <button className="px-3 py-1 text-purple-700">3</button>
              <button className="px-3 py-1 text-purple-700">4</button>
              <button className="px-3 py-1 text-purple-700">5</button>
              <button className="px-3 py-1 text-purple-700">6</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}