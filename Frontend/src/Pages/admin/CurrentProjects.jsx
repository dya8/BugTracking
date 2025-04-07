import { useState, useEffect } from "react";
import { FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import ProjectModal from "./ProjectModal"; // make sure this path is correct

export default function Projects({ adminId }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const projectsPerPage = 3;
  const adId = Number(adminId);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/${adId}/projects`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [adId]);

  // Filter projects based on search
  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar setShowModal={setShowModal} />
        <div className="p-6">

          {/* Header: Title + Search + Add Project */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold text-purple-700">Company Projects</h1>

            <div className="flex gap-4 items-center">
              {/* Search Input */}
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

              {/* Add Project Button */}
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                onClick={() => setShowModal(true)}
              >
                + Add Project
              </button>
            </div>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <div key={project.project_id} className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-purple-700">{project.project_name}</h2>
                  <a
                    href={`https://github.com/${project.git_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500"
                  >
                    <FaExternalLinkAlt />
                  </a>
                </div>

                <p className="text-gray-700 mt-2"><strong>Manager:</strong> {project.manager_name}</p>

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

          {/* Add Project Modal */}
          {showModal && (
            <ProjectModal
              setShowModal={setShowModal}
              adminId={adId}
              onProjectAdded={fetchProjects}
            />
          )}
        </div>
      </div>
    </div>
  );
}
