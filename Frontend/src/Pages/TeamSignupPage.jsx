/**import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TeamSignupPage = () => {
  const navigate = useNavigate(); // Must be inside the component

  const [collaborators, setCollaborators] = useState([{ email: "", role: "" }]);

  const handleChange = (index, e) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index][e.target.name] = e.target.value;
    setCollaborators(updatedCollaborators);
  };

  const addCollaborator = () => {
    setCollaborators([...collaborators, { email: "", role: "" }]);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Team Collaborators Form */
      /**<div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <h2 className="text-2xl font-bold text-purple-700 text-center">
          Add your team <br /> collaborators
        </h2>
        <div className="mt-6 w-80 space-y-4">
          {collaborators.map((collab, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-2/3 h-2/3 p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
                value={collab.email}
                onChange={(e) => handleChange(index, e)}
              />
              <select
                name="role"
                className="w-1/3 h-2/3 p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
                value={collab.role}
                onChange={(e) => handleChange(index, e)}
              >
                <option value="">Tester</option>
                <option value="Admin">Developer</option>
                <option value="Editor">Project Manager</option>
              </select>
            </div>
          ))}
          <button
            onClick={addCollaborator}
            className="px-4 py-2 border-[2px] border-purple-500 border-solid text-purple-500 bg-transparent rounded-md hover:bg-purple-100"
          >
            Add Another
          </button>

          {/* ✅ Navigate to Loading Page on Click */
        /** *  <button
            className="w-full p-3 bg-purple-700 text-white rounded-md mt-4"
            onClick={() => navigate("/loading")}
          >
            Finish Setup
          </button>
        </div>
        <p className="mt-4 text-gray-600">
          Already have an account?{" "}
          <span className="text-purple-700 cursor-pointer">Sign in</span>
        </p>
      </div>

      {/* Right Side - Welcome Back */
     {/** * <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 text-white p-8">
        <h2 className="text-3xl font-bold">Welcome Back...</h2>
        <p className="mt-4 text-center px-8">
          Get started with your new project by efficiently tracking bugs and
          collaborating with your team. <span className="font-bold">Sign In Now!</span>
        </p>
        <button className="mt-6 p-3 bg-purple-900 rounded-md text-white">
          Sign In Now!
        </button>
      </div>
    </div>
  );
};

export default TeamSignupPage;**/}


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TeamSignupPage = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState(""); // Input for company ID /*change comapny id to name*/
  const [projectName, setProjectName] = useState(""); // Input for project name
  const [collaborators, setCollaborators] = useState([{ email: "", role: "" }]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (index, e) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index][e.target.name] = e.target.value;
    setCollaborators(updatedCollaborators);
  };

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };
  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };
  const addCollaborator = () => {
    setCollaborators([...collaborators, { email: "", role: "" }]);
  };

  const handleSubmit = async () => {
    if (!companyName) {
      setError("Company Name is required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/team-signup", {
        collaborators,
        company_name: companyName, // Sending company_id to backend
        project_name: projectName, // Sending project_name to backend
      });

      setSuccessMessage(response.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 2000); // Navigate after showing message
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
      setSuccessMessage("");
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Team Collaborators Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <h2 className="text-2xl font-bold text-purple-700 text-center">
          Add your team <br /> collaborators
        </h2>
        <div className="mt-6 w-80 space-y-4">
          <input
            type="integer"
            placeholder="Enter Company Name"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
            value={companyName}
            onChange={handleCompanyNameChange}
          />
            <input
            type="text"
            placeholder="Enter Project Name"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
            value={projectName}
            onChange={handleProjectNameChange}
          />

          {collaborators.map((collab, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-2/3 p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
                value={collab.email}
                onChange={(e) => handleChange(index, e)}
              />
              <select
                name="role"
                className="w-1/3 p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
                value={collab.role}
                onChange={(e) => handleChange(index, e)}
              >
                <option value="">Select Role</option>
                <option value="Tester">Tester</option>
                <option value="Developer">Developer</option>
              
              </select>
            </div>
          ))}

          <button
            onClick={addCollaborator}
            className="px-4 py-2 border-[2px] border-purple-500 text-purple-500 bg-transparent rounded-md hover:bg-purple-100"
          >
            Add Another
          </button>

          <button
            className="w-full p-3 bg-purple-700 text-white rounded-md mt-4"
            onClick={handleSubmit}
          >
            Finish Setup
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
      </div>

      {/* Right Side - Welcome Back */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 text-white p-8">
        <h2 className="text-3xl font-bold">Welcome Back...</h2>
        <p className="mt-4 text-center px-8">
          Get started with your new project by efficiently tracking bugs and
          collaborating with your team. <span className="font-bold">Sign In Now!</span>
        </p>
        <button
          className="mt-6 p-3 bg-purple-900 rounded-md text-white"
          onClick={() => navigate("/login")}
        >
          Sign In Now!
        </button>
      </div>
    </div>
  );
};

export default TeamSignupPage;
