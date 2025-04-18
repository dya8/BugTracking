import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
export default function TrackBugs() {
  const navigate = useNavigate();

  // Sample bug data with Due Date & Time
  const [bugs, setBugs] = useState([]);
  const projectManagerId = 1; // Replace with actual logged-in Project Manager ID
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const totalPages = Math.ceil(bugs.length / recordsPerPage);
  const paginatedBugs = bugs.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const changePage = (pageNum) => setCurrentPage(pageNum);

  useEffect(() => {
    fetch(`http://localhost:3000/api/bugs/projmanager/${projectManagerId}`)
      .then((res) => res.json())
      .then((data) => setBugs(data))
      .catch((err) => console.error("Error fetching bugs:", err));
  }, [projectManagerId]);

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
                <th className="p-3">Assigned To</th>
                <th className="p-3">Bug Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Due/Resolved</th>
                <th className="p-3">View</th>
              </tr>
            </thead>
            <tbody>
              {bugs.length > 0 ? (
                paginatedBugs.map((bug) => (
                  <tr key={bug.bug_id} className="border-b hover:bg-purple-100">
                    <td className="p-3">{bug.bug_name}</td>
                    <td className="p-3">{bug.project_name}</td>
                    <td className="p-3">{bug.assigned_to}</td>
                    <td className={`p-3 font-semibold ${getStatusColor(bug.bug_status)}`}>
                      {bug.bug_status}
                    </td>
                    <td className="p-3">{bug.priority}</td>
                    <td className="p-3 font-semibold text-gray-800">
  {["Open", "In Progress", "Reopen"].includes(bug.bug_status)
    ? formatDate(bug.due)
    : ["Verified", "Resolved"].includes(bug.bug_status)
    ? formatDate(bug.resolved_at)
    : "-"}
</td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => goToBugDetails(bug.bug_id)}
                        className="bg-purple-600 hover:bg-purple-800 text-white p-2 rounded-md transition-all"
                      >
                        <FiArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-3">
                    No bugs to track
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

       
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => changePage(index + 1)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      currentPage === index + 1
                        ? "bg-purple-700 text-white shadow-md"
                        : "bg-purple-300 text-purple-900 hover:bg-purple-400"
                    }`}
                  >
                    {index + 1}
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