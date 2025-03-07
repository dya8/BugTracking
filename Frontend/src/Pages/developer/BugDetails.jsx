import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const BugDetails = () => {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");

  const bug = {
    name: "UI Button not clickable",
    project: "Project Alpha",
    priority: "High",
  };

  // Start the countdown when "Start Working" is clicked
  const startTimer = () => {
    setIsWorking(true);
    setMessage("");
    const deadline = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 hours from now
    localStorage.setItem("bugDeadline", deadline);
    updateTimer();
  };

  // Update timer
  const updateTimer = () => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const storedDeadline = localStorage.getItem("bugDeadline");
      const distance = storedDeadline - now;

      if (distance > 0) {
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        clearInterval(interval);
        setTimeLeft("Time Over! Bug Stuck");
        setIsWorking(false);
      }
    }, 1000);
  };

  useEffect(() => {
    const storedDeadline = localStorage.getItem("bugDeadline");
    if (storedDeadline) {
      updateTimer();
      setIsWorking(true);
    }
  }, []);

  // When resolved is clicked
  const resolveBug = () => {
    if (timeLeft && timeLeft !== "Time Over! Bug Stuck") {
      setMessage("🎉 Yeyyy! You have resolved the bug within the due time! 🎉");
      localStorage.removeItem("bugDeadline");
      setIsWorking(false);
    } else {
      setMessage("⏳ Time's up! The bug is stuck.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 w-full">
          <h2 className="text-2xl font-semibold text-purple-700 flex items-center">❗ Assigned Bugs</h2>

          <div className="mt-6 text-lg text-purple-700 font-semibold">
            Bug name: <span className="text-gray-800">{bug.name}</span>
          </div>
          <div className="mt-2 text-lg text-purple-700 font-semibold">
            Project name: <span className="text-gray-800">{bug.project}</span>
          </div>
          <div className="mt-2 text-lg text-purple-700 font-semibold">
            Priority: <span className="text-gray-800">{bug.priority}</span>
          </div>

          {/* Start Working Button */}
          <div className="mt-6">
            <button 
              onClick={startTimer} 
              className="px-6 py-3 bg-purple-700 text-white rounded-lg text-lg font-semibold shadow-lg">
              Start Working
            </button>
          </div>

          {/* Due Time Display */}
          {isWorking && (
            <div className="mt-6 text-lg font-semibold text-purple-700">
              ⏳ Due in: <span className="text-gray-800">{timeLeft}</span>
            </div>
          )}

          {/* Stuck Bugs Info */}
          <div className="mt-8 text-purple-700 font-semibold text-lg">
            Stuck Bugs
          </div>
          <p className="text-gray-700">If you are unable to complete within the given time, bug status changes to stuck.</p>

          {/* Resolved Button */}
          <div className="mt-6 text-purple-700 font-semibold text-lg">
            If bug is resolved within time click on
          </div>
          <button 
            onClick={resolveBug} 
            className="mt-2 px-6 py-3 bg-purple-700 text-white rounded-lg text-lg font-semibold shadow-lg">
            Resolved
          </button>

          {/* Message Display */}
          {message && (
            <div className="mt-4 text-lg font-semibold text-green-700">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BugDetails;