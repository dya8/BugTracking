import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FaArrowRight } from "react-icons/fa";

const AssignDue = () => {
const navigate = useNavigate(); // Hook for navigation
const [error, setError] = useState(null);

  /*const [bugs] = useState([
    { id: 1, name: "Login Issue", project: "Website", status: "Open", assignedBy: "QA A", priority: "High" },
    { id: 2, name: "Page Crash", project: "Mobile App", status: "Reopen", assignedBy: "QA B", priority: "Medium" },
  ]);
*/
const [bugs, setBugs] = useState([]);
  // Fetch bugs from API
  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/bugs/open", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Bugs:", data); // Debug log
        setBugs(data);
      } catch (error) {
        console.error("Error fetching bugs:", error);
        setError(error.message);
      }
    };

    fetchBugs();
  }, []); // Empty dependency to run only once
  // Filter only open or reopened bugs
  //const filteredBugs = bugs.filter((bug) => bug.status === "Open" || bug.status === "Reopen");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        <div className="flex flex-col p-6">
          <h2 className="text-2xl font-bold text-purple-700">Assign due</h2>
          <p className="text-gray-600">All assigned bugs {bugs.length}</p>

          <div className="mt-4 bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-200 text-purple-800">
                  <th className="py-2 px-4 text-left">Bug name</th>
                  <th className="py-2 px-4 text-left">Project name</th>
                  <th className="py-2 px-4 text-left">Bug status</th>
                  <th className="py-2 px-4 text-left">Assigned by</th>
                  <th className="py-2 px-4 text-left">Priority</th>
                  <th className="py-2 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {bugs.length > 0 ? (
                  bugs.map((bug,index) => (
                    <tr key={index} className="border-b hover:bg-purple-100">
                      <td className="py-2 px-4">{bug.bug_name || 'N/A'}</td>
                      <td className="py-2 px-4">{bug.project_name || 'N/A'}</td>
                      <td className="py-2 px-4 font-semibold text-red-600">{bug.bug_status || 'N/A'}</td>
                      <td className="py-2 px-4">{bug.assigned_to || 'N/A'}</td>
                      <td className="py-2 px-4 text-red-500 font-bold">{bug.priority || 'N/A'}</td>
                      <td className="py-2 px-4 text-right">
                        <FaArrowRight
                          className="text-purple-600 cursor-pointer hover:text-purple-800"
                          onClick={() => navigate(`/assign-due/bug/${bug.bug_id|| 'N/A'}`)} // Navigate on click
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-4">
                      No open or reopened bugs found.
                    </td>
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
};

export default AssignDue;
