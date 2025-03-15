import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function TrackBugs() {
  const navigate = useNavigate();

  // Sample bug data with Due Date & Time
  const [bugs] = useState([
    { id: 1, name: "Login Issue", project: "Website", assigned: "Dev A", status: "In Progress", priority: "High", due: "March 15, 3:00 PM" },
    { id: 2, name: "Page Crash", project: "Mobile App", assigned: "Dev B", status: "Verified", priority: "Medium", due: "March 18, 12:30 PM" },
    { id: 3, name: "UI Glitch", project: "Dashboard", assigned: "Dev C", status: "Resolved", priority: "Low", due: "March 20, 6:45 PM" },
    { id: 4, name: "API Timeout", project: "Backend", assigned: "Dev D", status: "Stuck", priority: "High", due: "March 22, 10:15 AM" }
  ]);

  const goToBugDetails = (bugId) => {
    navigate(`/trackbug/${bugId}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-100">
        <Navbar />

        <div className="p-6">
          <h1 className="text-xl font-bold text-purple-700">🐞 Track Bugs</h1>
          <p className="text-gray-600">All Bugs: {bugs.length}</p>

          <div className="bg-white shadow-md rounded-lg mt-4">
            <table className="w-full text-left border-collapse">
              <thead className="bg-purple-300 text-purple-900">
                <tr>
                  <th className="p-3">Bug Name</th>
                  <th className="p-3">Project Name</th>
                  <th className="p-3">Assigned On</th>
                  <th className="p-3">Bug Status</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Due (Date & Time)</th>
                  <th className="p-3">View</th>
                </tr>
              </thead>
              <tbody>
                {bugs.length > 0 ? (
                  bugs.map((bug) => (
                    <tr key={bug.id} className="border-b hover:bg-purple-100">
                      <td className="p-3">{bug.name}</td>
                      <td className="p-3">{bug.project}</td>
                      <td className="p-3">{bug.assigned}</td>
                      <td className={`p-3 font-semibold ${getStatusColor(bug.status)}`}>{bug.status}</td>
                      <td className="p-3">{bug.priority}</td>
                      <td className="p-3 font-semibold text-gray-800">{bug.due}</td>
                      {/* 🔥 Purple Arrow Button */}
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => goToBugDetails(bug.id)} 
                          className="bg-purple-600 hover:bg-purple-800 text-white p-2 rounded-md transition-all"
                        >
                          <FiArrowUpRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-3">No bugs to track</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 🔥 Pagination Fix */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-purple-700 text-white rounded-md shadow-md">1</button>
              <button className="px-3 py-1 bg-purple-300 text-purple-900 rounded-md hover:bg-purple-400">2</button>
              <button className="px-3 py-1 bg-purple-300 text-purple-900 rounded-md hover:bg-purple-400">3</button>
              <button className="px-3 py-1 bg-purple-300 text-purple-900 rounded-md hover:bg-purple-400">4</button>
              <button className="px-3 py-1 bg-purple-300 text-purple-900 rounded-md hover:bg-purple-400">5</button>
              <button className="px-3 py-1 bg-purple-300 text-purple-900 rounded-md hover:bg-purple-400">6</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "In Progress":
      return "text-blue-700";
    case "Verified":
      return "text-green-700";
    case "Resolved":
      return "text-gray-700";
    case "Stuck":
      return "text-red-700";
    default:
      return "text-black";
  }
}
