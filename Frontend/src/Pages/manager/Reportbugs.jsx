import React, { useState,useEffect} from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function ReportedBugs() {
  
  const [managerid,setManagerid]=useState(1);
  // Fetch bugs from API
  const [bugs, setBugs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 5;

const totalPages = Math.ceil(bugs.length / recordsPerPage);
const paginatedBugs = bugs.slice(
  (currentPage - 1) * recordsPerPage,
  currentPage * recordsPerPage
);
const changePage = (pageNum) => setCurrentPage(pageNum);
  // Fetch bugs from API
  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/bugs/${managerid}/open`);
        const data = await response.json();
        console.log("Bugs Data:", data);
        setBugs(data);
      } catch (error) {
        console.error("Error fetching bugs:", error);
      }
    };
    fetchBugs();
  }, [managerid]);

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
                  <th className="p-3">Assigned To</th>
                  <th className="p-3">Bug Status</th>
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
                      <td className="p-3">{bug.assigned_to}</td>
                      <td className="p-3">{bug.bug_status}</td>
                      <td className="p-3">{bug.priority}</td>
                      <td className="p-3">{bug.due || "—"}</td>
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
              : "bg-purple-200 text-purple-800 hover:bg-purple-300"
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