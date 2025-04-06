import React, { useState,useEffect } from "react";
import { useNavigate ,useParams} from "react-router-dom";
import { Button, TextField, Card, CardContent } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


const admindashboard = ({setAdminId}) => {
  const [projectName, setProjectName] = useState("");
  const[adminName,setAdminName]=useState("");
  const navigate = useNavigate();
  const { dashboardId } = useParams(); 
  useEffect(() => {
     console.log("Dashboard ID from URL:", dashboardId); // Debugging
     if (dashboardId) {
       const adId = Number(dashboardId); // Convert string to number
       setAdminId(adId);
       localStorage.setItem("userId", dashboardId); // 🔥 Store userId persistently
     }
 
     const fetchAdminName = async () => {
       try {
         const response = await fetch(`http://localhost:3000/api/Admin/${dashboardId}`);
         const data = await response.json();
         console.log("API Response:", data); // Debugging
   
         if (response.ok) {
           setAdminName(data.admin_name);
         } else {
           setAdminName("Unknown Admin");
         }
       } catch (error) {
         console.error("Error fetching developer name:", error);
         setAdminName("Unknown Admin");
       }
     };
   
     fetchAdminName();
   }, [dashboardId]);
    
  const handleShowStats = () => {
    if (projectName.trim() === "") {
      alert("Please enter a valid project name");
      console.warn("Invalid project name. Project name cannot be empty.");
      return;
    }
  
    console.log("Navigating to Project Stats for:", projectName);
    navigate(`/project-stats/${encodeURIComponent(projectName)}`);
  };
  

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
        <h2 className="text-purple-700 font-bold mb-4">
            Welcome {adminName} to your Admin Dashboard
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

export default admindashboard;
