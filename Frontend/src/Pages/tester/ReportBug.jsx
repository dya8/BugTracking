import { useState } from "react";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function ReportBugForm() {
  const [formData, setFormData] = useState({
    bugTitle: "",
    priority: "",
    assignedTo: "",
    projectName: "",
    bugType: "",
    bugStatus: "Open",
    description: "",
    comments: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ">
        <Navbar />
        <div className="p-6 max-w-5xl mx-auto pt-20">
          <h2 className="text-purple-700 text-2xl font-bold mb-6">+ Report a Bug</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <TextField 
                label="Bug title" 
                name="bugTitle" 
                value={formData.bugTitle} 
                onChange={handleChange} 
                fullWidth 
                variant="outlined" 
                sx={{
                  "& label": { color: "#9333ea" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#9333ea" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "#9333ea" },
                    "&:hover fieldset": { borderColor: "#9333ea !important" }
                  }
                }}
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
                sx={{
                  "& label": { color: "#9333ea" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#9333ea" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "#9333ea" },
                    "&:hover fieldset": { borderColor: "#9333ea !important" }
                  }
                }}
              />
              <TextField 
                label="Comments (optional)" 
                name="comments" 
                value={formData.comments} 
                onChange={handleChange} 
                fullWidth 
                variant="outlined" 
                sx={{
                  "& label": { color: "#9333ea" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#9333ea" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "#9333ea" },
                    "&:hover fieldset": { borderColor: "#9333ea !important" }
                  }
                }}
              />
            </div>
            <div className="space-y-4">
              <FormControl fullWidth variant="outlined" sx={{ borderRadius: "8px", "& .MuiInputLabel-root": { color: "#9333ea" }, "& fieldset": { borderColor: "#9333ea" }, "&:hover fieldset": { borderColor: "#9333ea !important" }}}>
                <InputLabel>Priority</InputLabel>
                <Select name="priority" value={formData.priority} onChange={handleChange}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ borderRadius: "8px", "& .MuiInputLabel-root": { color: "#9333ea" }, "& fieldset": { borderColor: "#9333ea" }, "&:hover fieldset": { borderColor: "#9333ea !important" } }}>
                <InputLabel>Assign to</InputLabel>
                <Select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                  <MenuItem value="Dev1">Developer 1</MenuItem>
                  <MenuItem value="Dev2">Developer 2</MenuItem>
                  <MenuItem value="Dev3">Developer 3</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ borderRadius: "8px", "& .MuiInputLabel-root": { color: "#9333ea" }, "& fieldset": { borderColor: "#9333ea" }, "&:hover fieldset": { borderColor: "#9333ea !important" } }}>
                <InputLabel>Project name</InputLabel>
                <Select name="projectName" value={formData.projectName} onChange={handleChange}>
                  <MenuItem value="ProjectA">Project A</MenuItem>
                  <MenuItem value="ProjectB">Project B</MenuItem>
                  <MenuItem value="ProjectC">Project C</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ borderRadius: "8px", "& .MuiInputLabel-root": { color: "#9333ea" }, "& fieldset": { borderColor: "#9333ea" }, "&:hover fieldset": { borderColor: "#9333ea !important" } }}>
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
              <Button variant="contained" color="secondary" className="bg-purple-700">Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
