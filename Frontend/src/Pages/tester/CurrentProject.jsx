import { useState, useEffect } from "react";
import { FaSearch, FaBug, FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Projects() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const projectsPerPage = 3;
  const testerId = 1;

  useEffect(() => {
    const fetchTesterProjects = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/projects/tester/${testerId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response Data:", data);
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects([]);
          console.warn("No projects found for this developer.");
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error.message);
      }
    };
    fetchTesterProjects();
  }, [testerId]);

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
          {/* Page Heading & Search */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-purple-700">Tester Projects</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Project Name"
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <div key={project.project_id} className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-purple-700">{project.project_name}</h2>
                  <a href="#" className="text-purple-500">
                    <FaExternalLinkAlt />
                  </a>
                </div>
                <p className="text-gray-700">Git ID: {project.git_id}</p>
                <p className="text-gray-700">Manager: {project.manager_name}</p>
                <p className="text-gray-700">Total Bugs: {project.total_bugs}</p>
                
                <h3 className="text-md font-bold mt-4">Bugs Reported by Tester:</h3>
                {project.reported_bugs.length > 0 ? (
                  <ul>
                    {project.reported_bugs.map((bug, index) => (
                      <li key={index} className="text-gray-600 flex items-center">
                        <FaBug className="mr-2 text-red-500" /> {bug.bug_name} - {bug.bug_status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No bugs reported by tester.</p>
                )}

                <h3 className="text-md font-bold mt-4">Bugs Verified by Tester:</h3>
                {project.verified_bugs.length > 0 ? (
                  <ul>
                    {project.verified_bugs.map((bug, index) => (
                      <li key={index} className="text-gray-600 flex items-center">
                        <FaCheckCircle className="mr-2 text-green-500" /> {bug.bug_name} - {bug.bug_status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No bugs verified by tester.</p>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
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
