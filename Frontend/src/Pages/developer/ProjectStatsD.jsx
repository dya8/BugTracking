import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const COLORS = ['#FF0000', '#FFA500', '#008000'];

// Custom Tooltip for BarChart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        padding: '2px 6px',            // Reduced padding
        fontSize: '10px',              // Smaller font
        lineHeight: '1.1',             // Tighter line spacing
        borderRadius: '3px',           // Slightly smaller corner radius
        maxWidth: '120px',             // Optional: constrain width
        boxShadow: 'none'              // Remove shadow if not needed
      }}>
      
        <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color, margin: 0 }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const ProjectStatsD = () => {
  const { projectName } = useParams();
  const [project, setProject] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [bugStatusData, setBugStatusData] = useState([]);
  const [devBugData, setDevBugData] = useState([]);
  const [testerBugData, setTesterBugData] = useState([]);

  const fetchProjectData = async () => {
    try {
      console.log("Fetching data for project:", projectName);
      const response = await fetch(`http://localhost:3000/api/project-stats/${encodeURIComponent(projectName)}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      console.log(data);
      setProject(data.project);
      setBugs(data.bugs);

      const statusCounts = { Stuck: 0, 'In Progress': 0, Resolved: 0 };
      data.bugs.forEach(bug => statusCounts[bug.bug_status]++);
      setBugStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

      setDevBugData(data.developers);
      setTesterBugData(data.testers);
    } catch (error) {
      console.error('Failed to fetch project data:', error.message);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with projectName:", projectName);
    fetchProjectData();
  }, [projectName]);

  if (!project) return <p>Loading project data...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h1 className="text-xl font-bold">Project Statistics - {project.project_name}</h1>

          <Card className="my-4 mx-2 w-full max-w-md p-2">
            <CardContent>
              <h2 className="text-xl font-semibold">Bug Status Overview</h2>
              <PieChart width={200} height={200}>
                <Pie data={bugStatusData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
                  {bugStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>

          <Card className="my-4 mx-2 w-full max-w-3xl p-2">
            <CardContent>
              <h2 className="text-xl font-semibold">Bug Resolution and Reporting</h2>
              <BarChart width={300} height={150} data={devBugData.concat(testerBugData)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="bugsResolved" fill="#82ca9d" name="Bugs Resolved (Developers)" />
                <Bar dataKey="bugsReported" fill="#ff7f50" name="Bugs Reported (Testers)" />
              </BarChart>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatsD;
