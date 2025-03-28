import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FaCheckCircle } from "react-icons/fa";

export default function VerifyBugDetails() {
  const { bugId } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Defined loading state
  const [message, setMessage] = useState("");
  const [buttonClicked, setButtonClicked] = useState(null);

  useEffect(() => {
    const fetchBug = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/verifybugs/${bugId}`);
        const data = await response.json();

        if (response.ok) {
          setBug(data.bug);
        } else {
          console.error("Error fetching bug:", data.message);
          setBug(null);
        }
      } catch (error) {
        console.error("Error fetching bug:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBug();
  }, [bugId]);

  const updateBugStatus = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bugs/${bugId}/update-status`, {
        method: "PATCH", // ✅ Changed from PUT to PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Bug status updated to ${newStatus}`);
        setButtonClicked(newStatus.toLowerCase());
        setBug({ ...bug, bug_status: newStatus });

        // Redirect back after 2 seconds
        setTimeout(() => navigate("/verify-bugs"), 2000);
      } else {
        setMessage(`Failed to update bug: ${data.message}`);
      }
    } catch (error) {
      setMessage("Error updating bug status");
      console.error("Error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!bug) return <div>Bug not found</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
            <FaCheckCircle className="mr-2" /> Verify Bugs
          </h1>
          <h2 className="text-3xl font-semibold mb-4">Bug Details</h2>
          <p><strong>Bug Name:</strong> {bug.bug_name}</p>
          <p><strong>Project Name:</strong> {bug.project_name || "N/A"}</p>
          <p><strong>Assigned to:</strong> {bug.assigned_to || "Unknown"}</p>
          <p><strong>Status:</strong> {bug.bug_status}</p>
          <p><strong>Priority:</strong> {bug.priority}</p>
          <p><strong>Resolved At:</strong> {bug.resolved_at ? new Date(bug.resolved_at).toLocaleString() : "N/A"}</p>

          <div className="mt-4">
            <button
              onClick={() => updateBugStatus("Verified")}
              disabled={buttonClicked === "reopen"}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              Verify
            </button>
            <button
              onClick={() => updateBugStatus("Reopen")}
              disabled={buttonClicked === "verified"}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer ml-2"
            >
              Reopen
            </button>
          </div>

          {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
      </div>
    </div>
  );
}
