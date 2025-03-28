import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function ReportedBugs() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/bugs"); // Update with your API URL
        if (!response.ok) {
          throw new Error("Failed to fetch bugs");
        }
        const data = await response.json();
        console.log("Bugs Data:", data);  
        setBugs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-100">
        <Navbar />

        <div className="p-6">
          <h1 className="text-xl font-bold text-purple-700">🔹 Reported Bugs</h1>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <>
              <p className="text-gray-600">Total Bugs: {bugs.length}</p>

              <div className="bg-white shadow-md rounded-lg mt-4">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-purple-200 text-purple-800">
                    <tr>
                      <th className="p-3">Bug Name</th>
                      <th className="p-3">Project Name</th>
                      <th className="p-3">Assigned To</th>
                      <th className="p-3">Bug Status</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Due</th> {/* Placeholder for future due date */}
                    </tr>
                  </thead>
                  <tbody>
                    {bugs.length > 0 ? (
                      bugs.map((bug) => (
                        <tr key={bug.bug_id} className="border-b hover:bg-gray-100">
  <td className="p-3">{bug.bug_name}</td>
  <td className="p-3">{bug.project_name}</td>
  <td className="p-3">{bug.assigned_to}</td>
  <td className="p-3">{bug.bug_status}</td>
  <td className="p-3">{bug.priority}</td>
  <td className="p-3 text-gray-700">
    {bug.due ? new Date(bug.due).toLocaleString() : "No Due Date"}
  </td>
</tr>

                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center p-3">
                          No reported bugs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
