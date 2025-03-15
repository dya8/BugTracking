import { useState } from "react";
import { FaSearch, FaUsers, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from "./navbar";  // Import your Navbar component
import Sidebar from "./sidebar"; // Import your Sidebar component

const projectsData = [
  { id: 1, name: "Project One", team: "Team Details", dueDate: "Due date", manager: "Project manager name", pending: 3, completed: 4 },
  { id: 2, name: "Project Two", team: "Team Details", dueDate: "Due date", manager: "Project manager name", pending: 2, completed: 5 },
  { id: 3, name: "Project Three", team: "Team Details", dueDate: "Due date", manager: "Project manager name", pending: 5, completed: 3 },
  { id: 4, name: "Project Four", team: "Team Details", dueDate: "Due date", manager: "Project manager name", pending: 1, completed: 6 },
  { id: 5, name: "Project Five", team: "Team Details", dueDate: "Due date", manager: "Project manager name", pending: 4, completed: 2 },
  { id: 6, name: "Project Six", team: "Team Details", dueDate: "Due date", manager: "Project manager name", pending: 0, completed: 8 },
];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  // Filter projects based on search input
  const filteredProjects = projectsData.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar Component */}
      <div className="flex-1">
        <Navbar /> {/* Navbar Component */}
        
        <div className="p-6">
          {/* Page Heading & Search */}
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

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <div key={project.id} className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-purple-700">{project.name}</h2>
                  <a href="#" className="text-purple-500">
                    <FaExternalLinkAlt />
                  </a>
                </div>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaUsers className="mr-2 text-purple-500" /> {project.team}
                </p>
                <p className="flex items-center text-gray-700 mt-1">
                  <FaCalendarAlt className="mr-2 text-purple-500" /> {project.dueDate}
                </p>
                <p className="text-gray-700 mt-1">{project.manager}</p>
                <p className="mt-2 text-sm">
                  <span className="text-yellow-600 font-semibold">Pending bugs:</span> {project.pending}
                </p>
                <p className="text-sm">
                  <span className="text-green-600 font-semibold">Completed bugs:</span> {project.completed}
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
