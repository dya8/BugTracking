import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function TrackBugs() {
  // Sample bug data (Replace with API call)
  const [bugs] = useState([
    { id: 1, name: "Login Error", project: "Website", assignedTo: "Dev A", status: "Open" },
    { id: 2, name: "Payment Failure", project: "E-Commerce", assignedTo: "Dev B", status: "Stuck" },
    { id: 3, name: "UI Crash on Load", project: "Mobile App", assignedTo: "Dev C", status: "Resolved" },
    { id: 4, name: "Database Timeout", project: "Backend API", assignedTo: "Dev D", status: "Stuck" },
    { id: 5, name: "Profile Image Not Uploading", project: "Social Media", assignedTo: "Dev E", status: "In Progress" },
  ]);

  // Function to get status color
  const getStatusClass = (status) => {
    const statusClasses = {
      Open: "bg-red-500",
      Stuck: "bg-orange-500",
      "In Progress": "bg-yellow-500",
      Resolved: "bg-green-500",
    };
    return `px-3 py-1 text-white rounded-full ${statusClasses[status] || "bg-gray-500"}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-purple-700">🐞 Track Bugs</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search bugs..."
        className="w-full mt-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* Bug List Table */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Bug Name</th>
              <th className="p-2">Project</th>
              <th className="p-2">Assigned To</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {bugs.map((bug) => (
              <tr key={bug.id} className="border-b hover:bg-gray-100">
                <td className="p-2">
                  <Link to={`/bug-details/${bug.id}`} className="text-purple-600 hover:underline">
                    {bug.name}
                  </Link>
                </td>
                <td className="p-2">{bug.project}</td>
                <td className="p-2">{bug.assignedTo}</td>
                <td className="p-2">
                  <span className={getStatusClass(bug.status)}>{bug.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
