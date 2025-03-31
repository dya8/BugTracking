import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Card, CardContent } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


const Managerdashboard = () => {
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();

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

export default Managerdashboard;
