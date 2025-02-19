import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Login Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <h2 className="text-2xl font-bold text-purple-700">Sign In to <br /> <span className="font-bold">your account</span></h2>
        <div className="mt-6 w-80 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 rounded-md bg-purple-100 text-purple-500 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-purple-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <p className="text-right text-sm text-blue-600 cursor-pointer">Forgot password?</p>
          <button className="w-full p-3 bg-purple-700 text-white rounded-md mt-4">Sign In</button>
        
        </div>
        <p className="mt-4 text-gray-600">Don’t have an account? <span className="text-blue-600 cursor-pointer">Sign up</span></p>
      </div>

      {/* Right Side - Welcome Message */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 text-white p-8">
        <h2 className="text-3xl font-bold">Welcome Back...</h2>
        <p className="mt-4 text-center px-8">Boost your team's productivity with seamless bug tracking and collaboration. Get started for <span className="font-bold">free</span> today!</p>
        <button className="mt-6 p-3 bg-purple-900 rounded-md text-white">Sign Up Now!</button>
      </div>
    </div>
  );
};

export default LoginPage;