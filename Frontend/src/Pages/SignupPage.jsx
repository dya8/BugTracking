{/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignupPage = () => {
  const navigate = useNavigate(); // Initialize navigation

  const [formData, setFormData] = useState({
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Signup Form */}
   {/*   <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <h2 className="text-2xl font-bold text-purple-700">Create your <br /> company account</h2>
        <div className="mt-6 w-80 space-y-4 text-purple-500">
          <input
            type="text"
            name="adminName"
            placeholder="Admin’s Name"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
            value={formData.adminName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="His/Her Email Address"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button
  className="w-full p-3 bg-purple-700 text-white rounded-md mt-4"
  onClick={() => navigate("/projectlogin")}
>
  Continue
</button>

        </div>
        
        {/* Redirect to Login Page */
      /* <p className="mt-4 text-gray-600">
          Already have an account? 
          <span 
            className="text-purple-700 cursor-pointer"
            onClick={() => navigate("/login")} // Navigate to Login Page
          >
            Sign in
          </span>
        </p>
      </div>

      {/* Right Side - Welcome Back */
     /*} <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 text-white p-8">
        <h2 className="text-3xl font-bold">Welcome Back...</h2>
        <p className="mt-4 text-center px-8">
          Get started with your new project by efficiently tracking bugs and collaborating with your team. 
          <span className="font-bold"> Sign In Now!</span>
        </p>
        <button 
          className="mt-6 p-3 bg-purple-900 rounded-md text-white"
          onClick={() => navigate("/login")} // Redirect on Button Click
        >
          Sign In Now!
        </button>
      </div>
    </div>
  );
};

export default SignupPage;**/}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.adminName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful!");
        navigate("/projectlogin");
      } else {
        setError(data.message || "Signup failed. Try again!");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Signup Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <h2 className="text-2xl font-bold text-purple-700">
          Create your <br /> company account
        </h2>
        <div className="mt-6 w-80 space-y-4 text-purple-500">
          <input
            type="text"
            name="adminName"
            placeholder="Admin’s Name"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
            value={formData.adminName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="His/Her Email Address"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            className="w-full p-3 bg-purple-700 text-white rounded-md mt-4"
            onClick={handleSubmit}
          >
            Continue
          </button>
        </div>

        {/* Redirect to Login Page */}
        <p className="mt-4 text-gray-600">
          Already have an account?
          <span
            className="text-purple-700 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </div>

      {/* Right Side - Welcome Back */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 text-white p-8">
        <h2 className="text-3xl font-bold">Welcome Back...</h2>
        <p className="mt-4 text-center px-8">
          Get started with your new project by efficiently tracking bugs and
          collaborating with your team.
          <span className="font-bold"> Sign In Now!</span>
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

export default SignupPage;
