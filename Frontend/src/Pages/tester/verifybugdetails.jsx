import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FaCheckCircle } from "react-icons/fa"; // Import the checkmark icon

export default function VerifyBugDetails() {
  const { bugId } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [message, setMessage] = useState("");
  const [buttonClicked, setButtonClicked] = useState(null);

  useEffect(() => {
    const fetchBug = async () => {
      console.log("Bug ID:", bugId);
      const bugs = [
        { id: "1", name: "Login Issue", project: "Website", assigned: "Dev A", status: "Resolved", priority: "High", due: "2024-03-15T10:00" },
        { id: "2", name: "Page Crash", project: "Mobile App", assigned: "Dev B", status: "Resolved", priority: "Medium", due: "2024-03-18T14:30" },
        { id: "3", name: "UI Glitch", project: "Dashboard", assigned: "Dev C", status: "Verified", priority: "Low", due: "2024-03-20T16:45" },
        { id: "4", name: "API Timeout", project: "Backend", assigned: "Dev D", status: "Reopen", priority: "High", due: "2024-03-22T09:15" },
      ];

      const foundBug = bugs.find((b) => b.id === bugId);

      if (foundBug) {
        setBug(foundBug);
      } else {
        console.error("Bug not found for ID:", bugId);
      }
    };

    fetchBug();
  }, [bugId]);

  const handleVerify = () => {
    setMessage("Bug has been verified and closed");
    setButtonClicked("verify");
    setTimeout(() => navigate("/verify-bugs"), 2000);
  };

  const handleReopen = () => {
    setMessage("Bug has been reopened");
    setButtonClicked("reopen");
    setTimeout(() => navigate("/verify-bugs"), 2000);
  };

  if (!bug) {
    return <div>Loading...</div>;
  }

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
          <p>Bug Name: {bug.name}</p>
          <p>Project Name: {bug.project}</p>
          <p>Assigned to: {bug.assigned}</p>
          <p>Status: {bug.status}</p>
          <p>Priority: {bug.priority}</p>
          <p>Due: {new Date(bug.due).toLocaleString()}</p>
          <div className="mt-4">
            <button
              onClick={handleVerify}
              disabled={buttonClicked === "reopen"}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              Verify
            </button>
            <button
              onClick={handleReopen}
              disabled={buttonClicked === "verify"}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer ml-2"
            >
              Reopen
            </button>
          </div>
          {message && <p className="mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
}