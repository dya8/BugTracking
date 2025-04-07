import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const BugDetails = () => {
  const { id } = useParams();
  const [bug, setBug] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [dueTime, setDueTime] = useState(null); // Store due time from backend


  useEffect(() => {
    // Fetch bug details from backend
    const fetchBugDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/bugs/${id}`);
        const data = await response.json();
        console.log("Fetched Bug Details:", data);
        setBug(data);

        if (data.due) {
          const dueTimestamp = new Date(data.due).getTime();
          setDueTime(dueTimestamp);
        }
        // Check if the bug is already in progress
        if (data.bug_status === "In Progress") {
          setIsWorking(true);
        }
      } catch (error) {
        console.error("Error fetching bug details:", error);
      }
    };

    fetchBugDetails();
  }, [id]);

  // Function to start the timer
    useEffect(() => {
      if (dueTime) {
          const interval = setInterval(async () => {
              const now = new Date().getTime();
              const remaining = dueTime - now;
  
              if (remaining > 0) {
                  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
                  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
                  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
                  const seconds = Math.floor((remaining / 1000) % 60);
                  setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
              } else {
                  clearInterval(interval);
                  setTimeLeft("Time Over! Bug Stuck");
                  setIsWorking(false);
                  try {
                    await fetch(`http://localhost:3000/api/bugs/${id}/stuck`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                    });
        
                    setBug((prev) => ({ ...prev, bug_status: "Stuck" }));
                  } catch (error) {
                    console.error("Error updating bug to stuck:", error);
                  }
              }
          }, 1000);
  
          return () => clearInterval(interval);
      }
  }, [dueTime,id]);
  

  const startNewTimer = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/bugs/${id}/start`, { method: "PUT" });
      const data = await response.json();
  
      if (response.ok) {
        setBug((prev) => ({ ...prev, bug_status: "In Progress", due: data.due })); // Update bug state
        setIsWorking(true);
        setMessage("");
  
        if (data.due) {
          const utcDueTime = new Date(data.due).getTime();
    const localDueTime = utcDueTime - new Date().getTimezoneOffset() * 60000;
    

    setDueTime(localDueTime);
        }
      } else {
        console.error("Error starting bug:", data.message);
      }
    } catch (error) {
      console.error("Error updating bug status:", error);
    }
  };
   

  // Resolve the bug
  const resolveBug = async () => {
    try {
      const resolvedAt = new Date().toISOString();
      const response = await fetch(`http://localhost:3000/api/bugs/resolve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved_at: resolvedAt }) 
      });

      if (!response.ok) throw new Error("Failed to resolve bug");

      setMessage("✅ Bug resolved successfully!");
      setBug((prev) => ({ ...prev, bug_status: "Resolved", resolved_at: resolvedAt }));
      setTimeLeft(null);
      setIsWorking(false);
    } catch (error) {
      console.error("Error resolving bug:", error);
      setMessage("❌ Error resolving bug. Try again.");
    }
  };
  
  if (!bug) return <div>Loading...</div>;

  const markBugAsStuck = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/bugs/${id}/stuck`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) throw new Error("Failed to mark bug as stuck");
  
      setBug((prev) => ({ ...prev, bug_status: "Stuck" }));
      setIsWorking(false);
      setTimeLeft(null);
      setMessage("🚫 Bug marked as stuck.");
    } catch (error) {
      console.error("Error marking bug as stuck:", error);
      setMessage("❌ Error marking bug as stuck.");
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 w-full">
          <h2 className="text-2xl font-semibold text-purple-700">❗ Bug Details</h2>

          <div className="mt-6 text-lg text-purple-700 font-semibold">
            Bug name: <span className="text-gray-800">{bug.bug_name}</span>
          </div>
          <div className="mt-2 text-lg text-purple-700 font-semibold">
  Project name: <span className="text-gray-800">{bug.project_name || "Unknown Project"}</span>
</div>

          <div className="mt-2 text-lg text-purple-700 font-semibold">
            Priority: <span className="text-gray-800">{bug.priority}</span>
          </div>

          {/* Start Working Button - Hide if already In Progress */}
          {!isWorking && (bug.bug_status === "Open" || bug.bug_status === "Reopen") &&(
            <div className="mt-6">
              <button
                onClick={startNewTimer}
                className="px-6 py-3 bg-purple-700 text-white rounded-lg text-lg font-semibold shadow-lg">
                Start Working
              </button>
            </div>
          )}

          {/* Due Time Display */}
          {isWorking && (
            <div className="mt-6 text-lg font-semibold text-purple-700">
              ⏳ Due in: <span className="text-gray-800">{timeLeft}</span>
            </div>
          )}

          {/* Stuck Bugs Info */}
          {bug.bug_status === "Stuck" && (
            <div className="mt-6 text-lg font-semibold text-red-600">
              ❌ This bug is stuck because time ran out.
            </div>
          )}

          {/* Resolved Button */}
          {isWorking && bug.bug_status === "In Progress" && (
            <div className="mt-6">
              <button
                onClick={resolveBug}
                className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold shadow-lg">
                Resolve
              </button>
              
    <div className="text-sm text-gray-600">
      ⚠️ If you're unable to resolve this bug, click the button below:
    </div>
    <button
      onClick={markBugAsStuck}
      className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-semibold shadow-lg"
    >
      I'm Stuck
    </button>
            </div>
          )}

          {/* Message Display */}
          {message && <div className="mt-4 text-lg font-semibold text-green-700">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default BugDetails;
