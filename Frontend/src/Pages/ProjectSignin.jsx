{/**import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectSignin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    githubId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Signup Form */
  /**     <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <h2 className="text-3xl font-bold text-purple-700 text-center">
          Create your project <br /> team account
        </h2>

        <div className="mt-6 w-80 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Project Manager’s Name"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-700 focus:outline-none"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="His/Her Email Address"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-700 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="github-id"
            placeholder="Project Github ID"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-700 focus:outline-none"
            value={formData.githubId}
            onChange={handleChange}
          />
         <button
  className="w-full p-3 bg-purple-700 text-white rounded-md mt-4"
  onClick={() => navigate("/team")}
>
  Continue
</button>

        </div>

        <p className="mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </div>

      {/* Right Side - Welcome Message */
 /**      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 text-white p-8 relative">
        <h2 className="text-3xl font-bold">Welcome Back...</h2>
        <p className="mt-4 text-center px-8">
          Get started with your new project by efficiently tracking bugs and
          collaborating with your team.{" "}
          <span className="font-bold">Sign In Now!</span>
        </p>
        <button
          className="mt-6 p-3 bg-purple-900 rounded-md text-white"
          onClick={() => navigate("/login")}
        >
          Sign In Now!
        </button>

        {/* Ladybug Image */
    /**    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          🐞 {/* Use an actual image tag if needed 
        </div>
      </div>
    </div>
  );
};

export default ProjectSignin;**/}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls

const ProjectSignin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    githubId: "",
  });

  const [error, setError] = useState(""); // For handling errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/project-signup", formData);
      alert(response.data.message); // Show success message
      navigate("/team"); // Redirect to the next step
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Signup Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <h2 className="text-3xl font-bold text-purple-700 text-center">
          Create your project <br /> team account
        </h2>

        <div className="mt-6 w-80 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Project Manager’s Name"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-700 focus:outline-none"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="His/Her Email Address"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-700 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="githubId"
            placeholder="Project GitHub ID"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-700 focus:outline-none"
            value={formData.githubId}
            onChange={handleChange}
          />
          <button className="w-full p-3 bg-purple-700 text-white rounded-md mt-4" onClick={handleSubmit}>
            Continue
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <p className="mt-4 text-gray-600">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/login")}>
            Sign in
          </span>
        </p>
      </div>

      {/* Right Side - Welcome Message */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 text-white p-8 relative">
        <h2 className="text-3xl font-bold">Welcome Back...</h2>
        <p className="mt-4 text-center px-8">
          Get started with your new project by efficiently tracking bugs and collaborating with your team.{" "}
          <span className="font-bold">Sign In Now!</span>
        </p>
        <button className="mt-6 p-3 bg-purple-900 rounded-md text-white" onClick={() => navigate("/login")}>
          Sign In Now!
        </button>
      </div>
    </div>
  );
};

export default ProjectSignin;
