import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompanySignin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/company-signup", {
        company_name: formData.companyName,
        email: formData.companyEmail,
      });

      alert(response.data.message);
      navigate("/signup"); // Navigate after successful signup
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Section - Signup Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-8">
        <button
          className="absolute top-4 left-4 text-xl text-gray-600"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <h2 className="text-3xl font-bold text-purple-700 text-center">
          Create your <br /> <span className="font-extrabold">company account</span>
        </h2>

        <div className="mt-6 w-80 space-y-4">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className="w-full p-3 rounded-md bg-gray-200 text-gray-700 focus:outline-none"
            value={formData.companyName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="companyEmail"
            placeholder="Company Email Address"
            className="w-full p-3 rounded-md bg-gray-200 text-gray-700 focus:outline-none"
            value={formData.companyEmail}
            onChange={handleChange}
          />
          <button
            className="w-full p-3 bg-purple-700 text-white rounded-md mt-4"
            onClick={handleSubmit} // Call handleSubmit on click
          >
            Continue
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
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

        {/* Indicator Dots */}
        <div className="mt-4 flex space-x-2">
          <span className="w-3 h-3 bg-purple-700 rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      {/* Right Section - Welcome Message */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 relative">
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

        {/* Ladybug Image */}
        <div className="absolute bottom-6 left-10">
          <img src="/bug.png" alt="Ladybug" className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
};

export default CompanySignin;
