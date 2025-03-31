import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, LinearProgress } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const COLORS = ['#FF0000', '#FFA500', '#008000'];

const ProjectStatsM = () => {
  const { projectName } = useParams();
  const [project, setProject] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [bugStatusData, setBugStatusData] = useState([]);
  const [devBugData, setDevBugData] = useState([]);
  const [testerBugData, setTesterBugData] = useState([]);

  // Fetch data from backend
  const fetchProjectData = async () => {
    try {
      console.log("Fetching data for project:", projectName); // Log the project name to check

      const response = await fetch(`http://localhost:3000/api/project-stats/${encodeURIComponent(projectName)}`);

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      console.log(data);
      setProject(data.project);
      setBugs(data.bugs);

      // Prepare Bug Status Data
      const statusCounts = { Stuck: 0, 'In Progress': 0, Resolved: 0 };
      data.bugs.forEach(bug => statusCounts[bug.bug_status]++);
      setBugStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

      // Prepare Developer Data
      setDevBugData(data.developers);

      // Prepare Tester Data
      setTesterBugData(data.testers);
    } catch (error) {
      console.error('Failed to fetch project data:', error.message);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with projectName:", projectName); // Log when useEffect is called
    fetchProjectData();
  }, [projectName]);

  if (!project) return <p>Loading project data...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold">Project Statistics - {project.project_name}</h1>

          {/* Project Progress */}
          <Card className="my-4">
            <CardContent>
              <h2 className="text-xl font-semibold">Project Progress</h2>
              <LinearProgress variant="determinate" value={project.projectProgress || 0} />
              <p>{Math.round(project.projectProgress || 0)}% Completed</p>
            </CardContent>
          </Card>

          {/* Bug Status Pie Chart */}
          <Card className="my-4">
            <CardContent>
              <h2 className="text-xl font-semibold">Bug Status Overview</h2>
              <PieChart width={400} height={400}>
                <Pie data={bugStatusData} dataKey="value" nameKey="name" outerRadius={150} fill="#8884d8" label>
                  {bugStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>

          {/* Bugs Resolved by Developers and Reported by Testers */}
          <Card className="my-4">
            <CardContent>
              <h2 className="text-xl font-semibold">Bug Resolution and Reporting</h2>
              <BarChart width={600} height={300} data={devBugData.concat(testerBugData)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
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

export default ProjectStatsM;
