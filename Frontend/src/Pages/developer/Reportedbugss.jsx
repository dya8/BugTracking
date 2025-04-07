import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AssignedBugss({userId}) {
 // const [developerid, setDeveloperid] = useState(); // Set the logged-in developer's ID
  const [bugs, setBugs] = useState([]);
  const developerid = Number(userId); // Assuming you have the developer ID from props or context
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/bugss/developer/${developerid}`);
        const data = await response.json();
        console.log("Bugs Assigned to Developer:", data);
        setBugs(data);
      } catch (error) {
        console.error("Error fetching bugs:", error);
      }
    };
    fetchBugs();
  }, [developerid]);
  
  // Pagination logic
  const totalPages = Math.ceil(bugs.length / recordsPerPage);
  const paginatedBugs = bugs.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const changePage = (pageNum) => setCurrentPage(pageNum);
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-100">
        <Navbar />

        <div className="p-6">
          <h1 className="text-xl font-bold text-purple-700">All Bugs</h1>
          <p className="text-gray-600">Total Bugs: {bugs.length}</p>

          <div className="bg-white shadow-md rounded-lg mt-4">
            <table className="w-full text-left border-collapse">
              <thead className="bg-purple-200 text-purple-800">
                <tr>
                  <th className="p-3">Bug Name</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Reported By</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Due</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBugs.length > 0 ? (
                  paginatedBugs.map((bug, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="p-3">{bug.bug_name}</td>
                      <td className="p-3">{bug.project_name}</td>
                      <td className="p-3">{bug.reported_by}</td>
                      <td className="p-3">{bug.bug_status}</td>
                      <td className="p-3">{bug.priority}</td>
                      <td className="p-3">
  {bug.due ? new Date(bug.due).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }) : "—"}
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-3">No assigned bugs</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
                {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-purple-700 text-white"
                        : "text-purple-700 bg-white border border-purple-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
          
