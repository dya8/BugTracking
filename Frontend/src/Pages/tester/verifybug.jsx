import React, { useState,useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function VerifyBugs({testerId}) {
  const [bugs, setBugs] = useState([]); // State for bugs
  const navigate = useNavigate();
  const tid = Number(testerId); 
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
   // Fetch resolved bugs from backend
   useEffect(() => {
    if (!tid) {
      console.error("Tester ID not found");
      return;
    }

    fetch(`http://localhost:3000/api/resolved/${tid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error || data.message) {
          setBugs([]);
        } else {
          setBugs(data.bugs||[]);
        }
      })
      .catch((err) => console.error("Error fetching bugs:", err));
  }, [tid]);

  const handleArrowClick = (bugId) => {
    navigate(`/verify-bugs/${bugId}`);
  };
  // Pagination calculations
  const totalPages = Math.ceil(bugs.length / recordsPerPage);
  const paginatedBugs = bugs.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const changePage = (pageNum) => {
    setCurrentPage(pageNum);
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
                  <th className="p-3">Assigned To</th>
                  <th className="p-3">Bug Status</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Resolved At</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
              {paginatedBugs.length > 0 ? (
                paginatedBugs.map((bug) => (
                    <tr key={bug.bug_id || bug.id} className="border-b hover:bg-gray-100">
                      <td className="p-3">{bug.bug_name}</td>
                      <td className="p-3">{bug.project_name || "N/A"}</td>
                      <td className="p-3">{bug.assigned_to}</td>
                      <td className="p-3">{bug.bug_status}</td>
                      <td className="p-3">{bug.priority}</td>
                      <td className="p-3 cursor-pointer">
                      {bug.resolved_at
                          ? new Date(bug.resolved_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="p-3 cursor-pointer">
                        <FaChevronRight
                          className="text-purple-600"
                          onClick={() => handleArrowClick(bug.bug_id)}
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

           {/* Pagination Controls */}
           {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => changePage(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-purple-700 text-white"
                        : "text-purple-700 bg-white border border-purple-300"
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