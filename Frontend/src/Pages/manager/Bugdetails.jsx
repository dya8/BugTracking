import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import Sidebar Component
import Navbar from "./Navbar"; // Import Navbar Component

const BugDetailsM = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Navbar */}
        <Navbar />

        {/* Bug Details Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-purple-700">⚠ Track Bugs</h2>
          <div className="mt-4 space-y-2 bg-white p-6 rounded-lg shadow">
            <p><strong>Bug Name:</strong> Bug 1</p>
            <p><strong>Project Name:</strong> Project A</p>
            <p><strong>Priority:</strong> High</p>
            <p><strong>Assigned To:</strong> Developer A</p>
            <p><strong>Assigned On:</strong> 2025-03-08</p>
            <p><strong>Bug Status:</strong> <span className="text-red-500">Stuck</span></p>
            <p><strong>Due Date:</strong> 2025-03-10</p>
          </div>

          <Link to="/reassign-bug">
            <button className="mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800">
              Reassign
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BugDetailsM;
