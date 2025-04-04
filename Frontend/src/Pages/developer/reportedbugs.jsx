import React, { useState ,useEffect} from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ReportBugss() {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

   
  const developerId = 1; // Assume project manager ID is available (Make it dynamic if needed)

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/bugs?developerId=${developerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bugs");
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
  }, []);

  const filteredBugs = bugs.filter((bug) =>
    bug.bug_name.toLowerCase().includes(search.toLowerCase())
  );

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
              {filteredBugs.length > 0 ? (
                        filteredBugs.map((bug) => (
                          <tr
                            key={bug.bug_id}
                            className="border-b hover:bg-gray-100"
                          >
                            <td className="p-3">{bug.bug_name}</td>
                            <td className="p-3">{bug.project_name}</td>
                            <td className="p-3">{bug.assigned_to}</td>
                            <td className="p-3">{bug.bug_status}</td>
                            <td className="p-3">{bug.priority}</td>
                            <td className="p-3 text-gray-400">N/A</td>
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