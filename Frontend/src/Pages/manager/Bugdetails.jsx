import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Tooltip,Button} from "@mui/material";

const BugDetailsM = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [developers, setDevelopers] = useState([]); // Store developers list
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSameDeveloper, setIsSameDeveloper] = useState(false); // NEW

  useEffect(() => {
    // Fetch bug details
    fetch(`http://localhost:3000/api/bugsM/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBug(data);
        setLoading(false);
        if (data.project_id) {
          fetchDevelopers(data.project_id); // Fetch developers for the project
        }
      })
      .catch((err) => {
        console.error("Error fetching bug details:", err);
        setLoading(false);
      });
  }, [id]);

  // Fetch developers assigned to the project
  const fetchDevelopers = (projectId) => {
    fetch(`http://localhost:3000/api/projects/${projectId}/developers`)
      .then((res) => res.json())
      .then((data) => setDevelopers(data))
      .catch((err) => console.error("Error fetching developers:", err));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dueDate || !selectedDeveloper) {
      alert("Both due date and reassigned developer are required!");
      return;
    }

    fetch(`http://localhost:3000/api/bugsM/${id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dueDate, assignedTo: selectedDeveloper }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Bug updated successfully!");
        navigate("/trackbugs");
      })
      .catch((err) => console.error("Error updating bug:", err));
  };
  const handleRecommend = async () => {
    try {
      const res = await axios.post("http://localhost:3000/recommend", {
        project_id: bug.project_id,
        bug_type: bug.bug_type,
        priority: bug.priority
      });
  
      const recommendedDevId = String(res.data.recommended_developer);
      setSelectedDeveloper(recommendedDevId);
      
      const dev = developers.find((d) => String(d.developer_id) === recommendedDevId);
const devName = dev ? dev.developer_name : `Developer ID ${recommendedDevId}`;
const currentDev = developers.find((d) => d.developer_name === bug.assigned_to);
const currentDevId = currentDev ? String(currentDev.developer_id) : "";

setIsSameDeveloper(currentDevId === recommendedDevId);

      alert(`🔮 Recommended Developer: ${devName}`);
    } catch (error) {
      console.error("Recommendation error:", error);
      alert("❌ Failed to get recommendation.");
    }
  };
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-10">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
            <button onClick={() => navigate("/trackbugs")} className="bg-purple-600 text-white px-3 py-1 rounded mb-4">
              ← Back to Bugs
            </button>
            <h2 className="text-xl font-bold text-purple-800 flex items-center justify-center gap-2">
              🐞 {bug.bug_name}
            </h2>
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
  {developers.map((dev) => {
    const isRecommended = String(dev.developer_id) === String(selectedDeveloper);
    return (
      <option
        key={dev.developer_id}
        value={dev.developer_id}
        style={{
          backgroundColor: isRecommended ? "#f3e8ff" : "white", // light purple for highlight
          fontWeight: isRecommended ? "bold" : "normal",
        }}
      >
        {dev.developer_name}
      </option>
    );
  })}
</select>

                <div className="mb-4 flex flex-col items-center gap-2">
  <Tooltip
    title="⚠️ This is an AI-generated recommendation and may not always be accurate. Please review before assigning."
    placement="top"
    arrow
    componentsProps={{
      tooltip: {
        sx: {
          backgroundColor: "#fff8e1",
          color: "#5d4037",
          fontSize: "0.85rem",
          border: "1px solid #ffe082",
          maxWidth: 300,
          textAlign: "center",
        },
      },
    }}
  >
    <Button
      variant="outlined"
      onClick={handleRecommend}
      sx={{
        color: "#9333ea",
        borderColor: "#9333ea",
        textTransform: "none",
        fontWeight: 500,
        padding: "6px 16px",
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "#9333ea",
          color: "#fff",
          borderRadius: "50%",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        i
      </div>
      Recommend Developer
    </Button>
  </Tooltip>

  {isSameDeveloper && (
    <div className="text-yellow-600 text-sm font-medium text-center">
      ⚠️ AI recommended the same developer currently assigned.<br />
      Please review before confirming.
    </div>
  )}
</div>

                {/*<label className="block text-purple-700 font-semibold mb-1">Extend Due Date:</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white text-black"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />*/}
                <label className="block text-purple-700 font-semibold mb-1">
  Extend Due Date:
</label>
<DatePicker
  selected={dueDate}
  onChange={(date) => setDueDate(date)}
  showTimeSelect
  dateFormat="Pp"
  placeholderText="Select due date and time"
  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white text-black"
/>


                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded w-full">
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugDetailsM;
