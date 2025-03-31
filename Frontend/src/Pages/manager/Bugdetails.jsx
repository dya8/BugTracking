import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const BugDetailsM = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const fetchBugDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/bugsM/${id}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setBug(data);
        setLoading(false);
        if (data.project_id) fetchDevelopers(data.project_id);
      } catch (error) {
        console.error("Error fetching bug details:", error);
        setLoading(false);
      }
    };

    const fetchDevelopers = async (projectId) => {
      try {
        const response = await fetch(`http://localhost:3000/api/projects/${projectId}/developers`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setDevelopers(data);
      } catch (error) {
        console.error("Error fetching developers:", error);
      }
    };

    fetchBugDetails();
  }, [id]);

  if (loading) return <div className="text-center text-gray-500">Loading bug details...</div>;
  if (!bug) return <div className="text-center text-red-500">Bug not found!</div>;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dueDate || !selectedDeveloper) {
      alert("Both due date and reassigned developer are required!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/bugsM/${id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueDate, assignedTo: selectedDeveloper }),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      alert("Bug updated successfully!");
      navigate("/trackbugs");
    } catch (error) {
      console.error("Error updating bug:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-10">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
            <button onClick={() => navigate("/trackbugs")} className="bg-purple-600 text-white px-3 py-1 rounded mb-4">← Back to Bugs</button>
            <h2 className="text-xl font-bold text-purple-800 flex items-center justify-center gap-2">🐞 {bug.bug_name}</h2>
            <p><strong>Project:</strong> <span className="text-gray-700">{bug.project_name}</span></p>
            <p><strong>Priority:</strong> <span className="text-red-500 font-semibold">{bug.priority}</span></p>
            <p><strong>Bug Status:</strong> <span className="text-red-500">{bug.bug_status}</span></p>
            <p><strong>Assigned to:</strong> <span className="text-gray-800">{bug.assigned_to}</span></p>
            <p><strong>Reported by:</strong> <span className="text-gray-800">{bug.reported_by}</span></p>
            <p><strong>Due Date:</strong> <span className="text-gray-700">{formatDate(bug.due)}</span></p>
            {bug.bug_status === "Stuck" && (
              <form onSubmit={handleSubmit} className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
                <label className="block text-purple-700 font-semibold mb-1">Reassign to:</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white text-black"
                  value={selectedDeveloper}
                  onChange={(e) => setSelectedDeveloper(e.target.value)}
                >
                  <option value="">Select Developer</option>
                  {developers.map((dev) => (
                    <option key={dev.developer_id} value={dev.developer_id}>{dev.developer_name}</option>
                  ))}
                </select>
                <label className="block text-purple-700 font-semibold mb-1">Extend Due Date:</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white text-black"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded w-full">Submit</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugDetailsM;
