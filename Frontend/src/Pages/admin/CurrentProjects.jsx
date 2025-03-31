import { useState, useEffect } from "react";
import { FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Projects() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const projectsPerPage = 3;
  const adminId = 1; // Example admin ID

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/${adminId}/projects`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response Data:", data);
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error.message);
      }
    };
    fetchProjects();
  }, [adminId]);

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
            <h1 className="text-2xl font-bold text-purple-700">Company Projects</h1>
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
                
                {/* Project Name and GitHub Link */}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-purple-700">{project.project_name}</h2>
                  <a href={`https://github.com/${project.git_id}`} target="_blank" rel="noopener noreferrer" className="text-purple-500">
                    <FaExternalLinkAlt />
                  </a>
                </div>
                
                {/* Manager Info */}
                <p className="text-gray-700 mt-2"><strong>Manager:</strong> {project.manager_name}</p>

                {/* Developers Section */}
                <p className="text-gray-700 mt-2"><strong>Developers ({project.developers_count}):</strong></p>
                {project.developers_names.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {project.developers_names.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No Developers Assigned</p>
                )}

                {/* Testers Section */}
                <p className="text-gray-700 mt-2"><strong>Testers ({project.testers_count}):</strong></p>
                {project.testers_names.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {project.testers_names.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No Testers Assigned</p>
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
