// ...imports
import { useState, useEffect } from "react";
import { FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import ProjectModal from "./ProjectModal";

export default function Projects({ adminId }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ NEW STATE
  const projectsPerPage = 3;
  const adId = Number(adminId);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/${adId}/projects`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
<<<<<<< Updated upstream
      console.log("Fetched Projects:", data); // <== 🔍 Check here
=======
      console.log("Fetched projects:", data); // ✅ Debug
>>>>>>> Stashed changes
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [adId]);

<<<<<<< Updated upstream
  const handleDelete = async (projectId) => {
    console.log("Deleting Project ID:", projectId);
    if (!projectId) {
      alert("Project ID is missing. Cannot delete.");
=======
  // Delete project
  const handleDelete = async (projectId) => {
    if (!projectId) {
      alert("Project ID is missing. Cannot delete.");
      console.warn("❌ Attempted to delete project with undefined ID.");
>>>>>>> Stashed changes
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

<<<<<<< Updated upstream
=======
    console.log("🗑️ Deleting project with ID:", projectId);

>>>>>>> Stashed changes
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/${adId}/projects/${projectId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
<<<<<<< Updated upstream
      alert("Project Deleted Successfully!");
      fetchProjects();
=======

      console.log("✅ Project deleted successfully");
      fetchProjects(); // Refresh list
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete the project. Please try again.");
    }
  };

<<<<<<< Updated upstream
=======
  // Filtered list
>>>>>>> Stashed changes
  const filteredProjects = projects.filter((project) =>
    project.project_name?.toLowerCase().includes(search.toLowerCase())
  );

<<<<<<< Updated upstream
=======
  // Pagination
>>>>>>> Stashed changes
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold text-purple-700">Company Projects</h1>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <FaSearch className="absolute top-3 left-3 text-gray-400" />
              </div>
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                onClick={() => setShowModal(true)}
              >
                + Add Project
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<<<<<<< Updated upstream
            {currentProjects.map((project) => (
              <div key={project.project_id} className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-purple-700">{project.project_name}</h2>
                  <div className="flex gap-3 items-center">
                    <a
                      href={`https://github.com/${project.git_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500"
                      title="GitHub Repo"
                    >
                      <FaExternalLinkAlt />
                    </a>
                    <button
                      onClick={() => handleDelete(project.project_id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Delete Project"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mt-2"><strong>Manager:</strong> {project.manager_name}</p>

                <p className="text-gray-700 mt-2"><strong>Developers ({project.developers_count}):</strong></p>
                {project.developers_names?.length > 0 ? (
  <ul className="list-disc pl-5">
    {project.developers_names.map((name, index) => (
      <li key={`${project.project_id}-dev-${index}`}>{name}</li>
    ))}
  </ul>
) : (
  <p className="text-gray-500">No Developers Assigned</p>
)}

{project.testers_names?.length > 0 ? (
  <ul className="list-disc pl-5">
    {project.testers_names.map((name, index) => (
      <li key={`${project.project_id}-test-${index}`}>{name}</li>
    ))}
  </ul>
) : (
  <p className="text-gray-500">No Testers Assigned</p>
)}

              </div>
            ))}
=======
            {currentProjects.map((project) => {
              console.log("📦 Project item:", project); // ✅ Debug each project
              return (
                <div key={project.project_id} className="bg-white p-4 rounded-lg shadow-md border">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-purple-700">{project.project_name}</h2>
                    <div className="flex gap-3 items-center">
                      <a
                        href={`https://github.com/${project.git_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500"
                        title="GitHub Repo"
                      >
                        <FaExternalLinkAlt />
                      </a>
                      <button
                        onClick={() => handleDelete(project.project_id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Delete Project"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-2"><strong>Manager:</strong> {project.manager_name}</p>

                  <p className="text-gray-700 mt-2"><strong>Developers ({project.developers_count}):</strong></p>
                  {project.developers_names?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {project.developers_names.map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No Developers Assigned</p>
                  )}

                  <p className="text-gray-700 mt-2"><strong>Testers ({project.testers_count}):</strong></p>
                  {project.testers_names?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {project.testers_names.map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No Testers Assigned</p>
                  )}
                </div>
              );
            })}
>>>>>>> Stashed changes
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
