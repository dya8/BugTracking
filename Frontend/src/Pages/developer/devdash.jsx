import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField, Card, CardContent } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Devdashboard = ({setUserId}) => {
  const [projectName, setProjectName] = useState("");
  const [developerName, setDeveloperName] = useState(""); 
  const navigate = useNavigate();
  const { dashboardId } = useParams(); 

  useEffect(() => {
    console.log("Dashboard ID from URL:", dashboardId); // Debugging
    if (dashboardId) {
      const devId = Number(dashboardId); // Convert string to number
      setUserId(devId);
      localStorage.setItem("userId", dashboardId); // 🔥 Store userId persistently
    }

    const fetchDeveloperName = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/developer/${dashboardId}`);
        const data = await response.json();
        console.log("API Response:", data); // Debugging
  
        if (response.ok) {
          setDeveloperName(data.developer_name);
        } else {
          setDeveloperName("Unknown Developer");
        }
      } catch (error) {
        console.error("Error fetching developer name:", error);
        setDeveloperName("Unknown Developer");
      }
    };
  
    fetchDeveloperName();
  }, [dashboardId]);
    const handleShowStats = () => {
    if (projectName.trim() === "") {
      alert("Please enter a valid project name");
      return;
    }

    navigate(`/project-statsD/${encodeURIComponent(projectName)}`);
  };
   
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h2 className="text-purple-700 font-bold mb-4">
            Welcome {developerName} to your Developer Dashboard
          </h2>
          <Card className="mb-4">
            <CardContent>
              <h2 className="text-purple-700 font-bold mb-4">View Project Stats</h2>
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

export default Devdashboard;
