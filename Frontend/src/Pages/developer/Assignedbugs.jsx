import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const AssignedBugs= ({ userId }) => {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const developerId= Number(userId);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  
  // Pagination logic
  const totalPages = Math.ceil(bugs.length / recordsPerPage);
  const paginatedBugs = bugs.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const changePage = (pageNum) => setCurrentPage(pageNum);

  console.log(`Sending developerid as: ${developerId}, Type: ${typeof developerId}`);
  useEffect(() => {
    if (!developerId) return; // Ensure developerId is available

    const fetchBugs = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/bugs/assigned?developerId=${developerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch assigned bugs");
        }
        const data = await response.json();
        setBugs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, [developerId]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-purple-700">❗ Assigned Bugs</h2>
            <div className="relative">
              <input type="text" placeholder="Search" className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none" />
              <FaSearch className="absolute left-2 top-3 text-gray-500" />
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow p-4">
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : (
              <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-purple-200 text-purple-800">
                    <th className="p-3">Bug Name</th>
                    <th className="p-3">Project Name</th>
                    <th className="p-3">Bug Status</th>
                    <th className="p-3">Assigned By</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {bugs.length > 0 ? (
                    paginatedBugs.map((bug) => <BugRow key={bug.bug_id} bug={bug} />)
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-3">
                        No assigned bugs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            
               {/* Pagination controls */}
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
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BugRow = ({ bug }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!bug.due || isNaN(new Date(bug.due).getTime())) {
      console.error("Invalid due date received:", bug.due);
      setTimeLeft("Invalid due date");
      return;
    }

    const updateTimeLeft = () => {
      const dueTime = new Date(bug.due).getTime();
      const now = Date.now();
      const remaining = dueTime - now;

      if (remaining > 0) {
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

        if (days > 0) {
          setTimeLeft(`Due in ${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeLeft(`Due in ${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`Due in ${minutes}m`);
        }
      } else {
        setTimeLeft("Time Over! Bug Stuck");
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [bug.due]);

  return (
    <tr className="border-t text-gray-700">
      <td className="p-3">{bug.bug_name}</td>
      <td className="p-3">{bug.project_name}</td>
      <td className="p-3 text-purple-600 font-semibold">{bug.bug_status}</td>
      <td className="p-3">{bug.assigned_by}</td>
      <td className="p-3">{bug.priority}</td>
      <td className="p-3">
        <button
          onClick={() => navigate(`/bug-details/${bug.bug_id}`)}
          className="text-purple-700 font-semibold hover:underline flex items-center"
        >
          {timeLeft} ➜
        </button>
      </td>
    </tr>
  );
};

export default AssignedBugs;
