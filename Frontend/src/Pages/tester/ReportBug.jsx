import { useState, useEffect } from "react";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import dayjs from "dayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { Tooltip } from "@mui/material";

export default function ReportBugForm() {
  const [testId,setTesterId] =useState(1);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [assignedTo, setAssignedTo] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
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

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axios.get(`http://localhost:3000/api/tester/${testId}/projects`);
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    }
    fetchProjects();
  }, [testId]);

  // Fetch developers when project changes
  useEffect(() => {
    async function fetchDevelopers() {
      if (!selectedProject) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/projectss/${selectedProject}/developers`);
        setDevelopers(response.data.developers);
      } catch (error) {
        console.error("Error fetching developers:", error);
        setDevelopers([]);
      }
    }
    fetchDevelopers();
  }, [selectedProject]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "projectName") {
      const selectedProjectId = projects.find(proj => proj.name === value)?.id;
      setSelectedProject(selectedProjectId || "");
      setFormData((prev) => ({ ...prev, assignedTo: "" }));
    }
  };

  // Handle developer recommendation
  const handleRecommend = async () => {
    if (!selectedProject || !formData.bugType || !formData.priority) {
      alert("Please select project, bug type, and priority first.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/recommend", {
        project_id: selectedProject,
        bug_type: formData.bugType,
        priority: formData.priority
      });

      const recommendedDevId = String(res.data.recommended_developer);

      // ✅ Safe .find() check
      const recommendedDev = Array.isArray(developers)
        ? developers.find((dev) => String(dev.developer_id) === recommendedDevId)
        : null;

      const nameToShow = recommendedDev
        ? recommendedDev.developer_name
        : `Developer ID ${recommendedDevId}`;

      alert(`🔮 Recommended developer: ${nameToShow}`);
    } catch (error) {
      console.error("Error recommending developer:", error);
      alert("❌ Failed to get recommendation.");
    }
  };
  
  const handleClear = () => {
    setFormData({
      bugTitle: "",
      priority: "",
      assignedTo: "",
      projectName: "",
      bugType: "",
      bugStatus: "Open",
      description: "",
      comments: "",
      dueDate: dayjs().add(2, "hour"),
    });
    setSelectedProject("");
    setDevelopers([]);
  };
  

  // Handle final submission
  const handleSubmit = async () => {
    if (!testId) {
      console.error("Tester ID not available!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/bugs/report", {
        bug_name: formData.bugTitle,
        description: formData.description,
        bug_type: formData.bugType,
        bug_status: "Open",
        comments: formData.comments,
        project_id: selectedProject,
        assigned_to: formData.assignedTo,
        priority: formData.priority,
        reported_by: testerId,
        due: formData.dueDate ? formData.dueDate.toISOString() : null
      });
      if (!formData.description.trim()) {
        alert("Please enter a description for the bug.");
        return;
      }
      
      alert("🐞 Bug reported successfully!");
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
          ) : !testId ? (
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
                  value="Open"
                  fullWidth
                  variant="outlined"
                  disabled
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Due Date & Time"
                    value={formData.dueDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        setFormData((prev) => ({ ...prev, dueDate: newValue }));
                      }
                    }}
                    slotProps={{ textField: { fullWidth: true, variant: "outlined" } }}
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

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "16px" }}>
  <FormControl fullWidth variant="outlined" disabled={!selectedProject}>
    <InputLabel>Assign to</InputLabel>
    <Select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
      {Array.isArray(developers) && developers.length > 0 ? (
        developers.map((dev) => (
          <MenuItem key={dev.developer_id} value={String(dev.developer_id)}>
            {dev.developer_name}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="">No developers available</MenuItem>
      )}
    </Select>
  </FormControl>

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
        marginTop: "16px",
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
        }}
      >
        i
      </div>
      Recommend Developer
    </Button>
  </Tooltip>
</div>



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
                    <MenuItem value="Backend">Crash</MenuItem>
                    <MenuItem value="Performance">Data Loss</MenuItem>
                    <MenuItem value="Performance">Security Vulnerability</MenuItem>
                    <MenuItem value="Performance">Performance Issue</MenuItem>
                    <MenuItem value="Performance">Functionality Bug</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-span-2 flex justify-between mt-6">
                <Button variant="contained" color="secondary" className="bg-purple-700" onClick={handleClear}>Clear</Button>
                <Button variant="contained" color="secondary" className="bg-purple-700" onClick={handleSubmit}>Submit</Button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
