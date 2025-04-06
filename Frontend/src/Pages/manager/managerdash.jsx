import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField, Card, CardContent } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Managerdashboard = ({ setManagerId }) => {
  const [projectName, setProjectName] = useState("");
  const [managerName, setManagerName] = useState("");
  const navigate = useNavigate();
  const { dashboardId } = useParams(); // e.g., /manager-dashboard/:dashboardId

  useEffect(() => {
    console.log("Dashboard ID from URL:", dashboardId);
    if (dashboardId) {
      const id = Number(dashboardId);
      localStorage.setItem("userId", dashboardId);

      // If this component is used to update a global manager ID
      if (setManagerId) setManagerId(id);
    }

    const fetchManagerName = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/manager/${dashboardId}`);
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setManagerName(data.manager_name || "Unnamed Manager");
        } else {
          setManagerName("Unknown Manager");
        }
      } catch (error) {
        console.error("Error fetching manager name:", error);
        setManagerName("Unknown Manager");
      }
    };

    fetchManagerName();
  }, [dashboardId, setManagerId]);

  const handleShowStats = () => {
    if (projectName.trim() === "") {
      alert("Please enter a valid project name");
      console.warn("Invalid project name. Project name cannot be empty.");
      return;
    }

    console.log("Navigating to Project Stats for:", projectName);
    navigate(`/project-statsM/${encodeURIComponent(projectName)}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <Card className="mb-4">
            <CardContent>
              <h2 className="text-purple-700 font-bold mb-4">
                Welcome, {managerName}
              </h2>
              <TextField
                label="Enter Project Name"
                variant="outlined"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                fullWidth
                className="mb-4"
              />
              <Button variant="contained" color="primary" onClick={handleShowStats}>
                Show Stats
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Managerdashboard;
