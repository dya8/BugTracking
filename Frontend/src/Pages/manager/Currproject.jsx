import { useState, useEffect } from "react";
import { FaSearch, FaUsers, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Projects() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const projectsPerPage = 3;
  const managerId = 1; // Example manager ID

  console.log(`Sending managerid as: ${managerId}, Type: ${typeof managerId}`);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/projects/manager/${managerId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response Data:", data);
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects([]);
          console.warn("No projects found for this manager.");
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error.message);
      }
    };
    fetchProjects();
  }, [managerId]);

  // Filter projects based on search input
  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-2xl font-bold text-purple-700">Managed Projects</h1>
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
            {currentProjects.map((project, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md border">
                <h2 className="text-lg font-bold text-purple-700">{project.project_name}</h2>
                
                <p className="flex items-center text-gray-700 mt-2">
                  <FaUsers className="mr-2 text-purple-500" /> Developers: {project.developers_count}
                </p>
                <p className="flex items-center text-gray-700">
                  <FaUsers className="mr-2 text-blue-500" /> Testers: {project.testers_count}
                </p>
                
                <p className="mt-2 text-sm">
                  <span className="text-yellow-600 font-semibold">Pending Bugs:</span> {project.pending_bugs}
                </p>
                <p className="text-sm">
                  <span className="text-red-600 font-semibold">Stuck Bugs:</span> {project.stuck_bugs}
                </p>
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
