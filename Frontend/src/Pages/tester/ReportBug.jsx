import { useState,useEffect } from "react";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import dayjs from "dayjs"; // To format date
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import axios from "axios"; // Import Axios
export default function ReportBugForm() {
  const [testerId, setTesterId] = useState(1); // Store tester ID
  const [loading, setLoading] = useState(false); // Handle loading state
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]); 
  const [selectedProject, setSelectedProject] = useState(""); // Track selected project
  const [formData, setFormData] = useState({
    bugTitle: "",
    priority: "",
    assignedTo: "",
    projectName: "",
    bugType: "",
    bugStatus: "Open",
    description: "",
    comments: "",
    dueDate: dayjs().add(2, "hour")
  });
 
  useEffect(() => {
    async function fetchProjects() {
        try {
          console.log("Sending tester_id:", testerId); // Debugging log
            const response = await axios.get("http://localhost:3000/api/tester/projects");
            console.log("✅ Response data:", response.data);
            setProjects(response.data.projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
            setProjects([]);
        }
    }
    fetchProjects();
}, [testerId]); // Include testerId as a dependency to ensure it's used
 // Fetch developers when a project is selected
 useEffect(() => {
  async function fetchDevelopers() {
    if (!selectedProject) return;
    try {
      console.log("Fetching developers for project:", selectedProject);
      const response = await axios.get(`http://localhost:3000/api/projects/${selectedProject}/developers`);
      console.log("Developers:", response.data);
      setDevelopers(response.data.developers);
    } catch (error) {
      console.error("Error fetching developers:", error);
      setDevelopers([]);
    }
  }
  fetchDevelopers();
}, [selectedProject]);
   
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "projectName") {
      const selectedProjectId = projects.find(proj => proj.name === value)?.id;
      setSelectedProject(selectedProjectId || ""); // Store project ID
      setFormData((prev) => ({ ...prev, assignedTo: "" })); // Reset assignedTo when project changes
    }
  };

  const handleSubmit = async () => {
    if (!testerId) {
      console.error("Tester ID not available!");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/bugs/report", {
        bug_name: formData.bugTitle,
        description: formData.description,
        bug_type: formData.bugType,
        bug_status:"Open",
        comments: formData.comments,
        project_id: selectedProject,
        assigned_to: formData.assignedTo, // Ensure this is valid
        priority: formData.priority,
        reported_by:testerId, // Attach tester ID
        due: formData.dueDate ? formData.dueDate.toISOString() : null
      });
      alert("Bug reported successfully!");
    } catch (error) {
      console.error("Error reporting bug:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 max-w-5xl mx-auto pt-20">
          <h2 className="text-purple-700 text-2xl font-bold mb-6">+ Report a Bug</h2>

          {loading ? (
            <p>Loading tester details...</p>
          ) : !testerId ? (
            <p className="text-red-500">Error: Unable to fetch tester details.</p>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <TextField 
                  label="Bug title" 
                  name="bugTitle" 
                  value={formData.bugTitle} 
                  onChange={handleChange} 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& label": { color: "#9333ea" }, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
                <TextField 
                  label="Description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  fullWidth 
                  multiline 
                  rows={3} 
                  variant="outlined"
                />
                <TextField 
                  label="Comments (optional)" 
                  name="comments" 
                  value={formData.comments} 
                  onChange={handleChange} 
                  fullWidth 
                  variant="outlined"
                />
                <TextField 
                label="Bug Status" 
                name="bugStatus"
                value="Open"  // ✅ Always set to 'Open'
                fullWidth 
                variant="outlined"
                disabled // ✅ Prevents changes
                />
                {/* ✅ DateTime Picker */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DateTimePicker
    label="Due Date & Time"
    value={formData.dueDate} 
    onChange={(newValue) => {
      if (newValue) {
        setFormData((prev) => ({ ...prev, dueDate: newValue }));
      }
    }}
    slotProps={{ textField: { fullWidth: true, variant: "outlined" } }} // ✅ Use slotProps instead of renderInput
      />
</LocalizationProvider>

              </div>
              <div className="space-y-4">
                <FormControl fullWidth variant="outlined">
                <InputLabel>Project name</InputLabel>
                <Select name="projectName" value={formData.projectName} onChange={handleChange}>
                {Array.isArray(projects) && projects.length > 0 ? (
               projects.map((project) => (
                <MenuItem key={project.id} value={project.name}>
                {project.name}
                </MenuItem>
                ))
              ) : (
                <MenuItem value="">No projects available</MenuItem>
              )}
              </Select>
                </FormControl>
                  {/* Developer Selection */}
              <FormControl fullWidth variant="outlined" disabled={!selectedProject}>
                <InputLabel>Assign to</InputLabel>
                <Select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                  {developers.length > 0 ? (
                    developers.map((dev) => (
                      <MenuItem key={dev.developer_id} value={dev.developer_id}>
                        {dev.developer_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No developers available</MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                  <InputLabel>Priority</InputLabel>
                  <Select name="priority" value={formData.priority} onChange={handleChange}>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Bug type</InputLabel>
                  <Select name="bugType" value={formData.bugType} onChange={handleChange}>
                    <MenuItem value="UI">UI Issue</MenuItem>
                    <MenuItem value="Backend">Backend Issue</MenuItem>
                    <MenuItem value="Performance">Performance Issue</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-span-2 flex justify-between mt-6">
                <Button variant="contained" color="secondary" className="bg-purple-700">Clear</Button>
                <Button variant="contained" color="secondary" className="bg-purple-700" onClick={handleSubmit}>Submit</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
