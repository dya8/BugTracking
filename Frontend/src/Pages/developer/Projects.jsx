import { useState, useEffect } from "react";
import { FaSearch, FaUsers, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from "./navbar"; 
import Sidebar from "./sidebar";
import { useParams } from "react-router-dom";

export default function Projects() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const projectsPerPage = 3;
  const devid = 1;

  console.log(`Sending developerid as: ${devid}, Type: ${typeof devid}`);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/projects/developer/${devid}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response Data:", data); // Should log a developer object
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects([]);
          console.warn("No projects found for this developer.");
        }
      } catch (error) {
        console.error("Failed to fetch developer:", error.message);
      }
    };
    fetchDeveloper();
  }, [devid]);

  // Filter projects based on search input
  const filteredProjects = projects.filter((project) =>
    project.project_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-purple-700">Current Projects</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <div key={project.project_id} className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-purple-700">{project.project_name}</h2>
                  <a href={`https://github.com/${project.git_id}`} className="text-purple-500">
                    <FaExternalLinkAlt />
                  </a>
                </div>
                <p className="text-gray-700 mt-2">Manager: {project.manager_name}</p>
                <p className="text-gray-700 mt-1">Total Bugs: {project.total_bugs}</p>
                
                <h3 className="mt-3 font-semibold">Bug Details:</h3>
                <ul className="list-disc pl-5">
                  {project.bugs.map((bug, index) => (
                    <li key={index}>
                      {bug.bug_name} - <span className={
                        bug.bug_status === 'Open' ? 'text-red-500' : 'text-green-500'
                      }>{bug.bug_status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === i + 1 ? "bg-purple-500 text-white" : "text-purple-700"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
