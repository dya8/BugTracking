import React, { useState,useEffect} from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function ReportedBugs() {
  
  
  // Fetch bugs from API
  const [bugs, setBugs] = useState([]);

  // Fetch bugs from API
  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/bugs/open");
        const data = await response.json();
        setBugs(data);
      } catch (error) {
        console.error("Error fetching bugs:", error);
      }
    };
    fetchBugs();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="p-6">
          <h1 className="text-xl font-bold text-purple-700">🔹 Reported Bugs</h1>
          <p className="text-gray-600">Total Bugs: {bugs.length}</p>

          {/* Bug Table */}
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
                </tr>
              </thead>
              <tbody>
                {bugs.length > 0 ? (
                  bugs.map((bug) => (
                    <tr key={bug.id} className="border-b hover:bg-gray-100">
                      <td className="p-3">{bug.bug_name}</td>
                      <td className="p-3">{bug.project_name}</td>
                      <td className="p-3">{bug.assigned_to}</td>
                      <td className="p-3">{bug.bug_status}</td>
                      <td className="p-3">{bug.priority}</td>
                      <td className="p-3">{bug.due}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-3">No reported bugs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
