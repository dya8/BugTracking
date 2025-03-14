import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FaCalendarAlt } from "react-icons/fa";

const CurrProject = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Navbar */}
        <Navbar />

        {/* Project Details Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-purple-700 flex items-center">
            📂 Current projects
          </h2>
          <p className="text-gray-600">All projects <span className="text-purple-700 font-semibold">4</span></p>

          {/* Project Card */}
          <div className="mt-4 bg-white p-6 rounded-lg shadow-md w-80">
            <h3 className="font-bold text-lg text-purple-700">Project one</h3>
            <div className="flex items-center text-gray-700 mt-2">
              <FaCalendarAlt className="mr-2 text-purple-500" />
              <span>Due date</span>
            </div>
            <p className="text-gray-600">Pending bugs <span className="font-semibold">3</span></p>
            <p className="text-gray-600">Completed bugs <span className="font-semibold">4</span></p>
            <p className="text-gray-600">Last updated</p>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              className={`mx-1 px-3 py-1 rounded-full ${num === 1 ? 'bg-purple-500 text-white' : 'text-purple-700'}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrProject;