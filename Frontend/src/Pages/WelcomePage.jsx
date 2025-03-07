import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLetsGo = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white text-center px-4"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundColor: "#6B46C1", // Purple color (#6B46C1 is Tailwind's purple-700)
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "multiply", // Blends image with background color
      }}
    >
      {/* Title */}
      <h1 className="text-4xl md:text-5xl text-white font-bold">
        Welcome to <br /> Bug Tracker!
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-lg md:text-xl">
        <strong>New Here?</strong> <br />
        Bug Tracker is a centralized platform for development teams to track, manage, and resolve bugs efficiently.{" "}
        <span className="font-bold">Join Now!</span>
      </p>

      {/* Button */}
      <button
        onClick={handleLetsGo}
        className="mt-6 px-6 py-3 bg-purple-900 hover:bg-purple-800 text-white text-lg font-semibold rounded-lg shadow-md transition"
      >
        Let’s Go!
      </button>

      {/* Contact Us */}
      <p className="mt-6 text-sm underline cursor-pointer hover:text-gray-200">
        Contact Us
      </p>

      {/* Ladybug Image */}
      <img
        src="/bug.png"
        alt="Ladybug"
        className="absolute bottom-0 left-0 w-40 md:w-52"
      />
    </div>
  );
};

export default WelcomePage;
