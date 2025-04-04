import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

  const aboutUsRef = useRef(null);
  const contactUsRef = useRef(null);

  const handleLetsGo = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white text-center px-4" 
      style={{
        backgroundImage: "url('/background.png')",
        backgroundColor: "#6B46C1",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "multiply",
      }}>
      
      {/* Navbar */}
      <nav className="absolute top-5 left-5 right-5 flex justify-between items-center text-lg font-semibold">
        <span className="text-white text-2xl font-bold">LOGO</span>
        <div className="flex space-x-6">
          <button onClick={() => setActiveSection("home")} className="hover:text-gray-300">Home</button>
          <button onClick={() => setActiveSection("aboutUs")} className="hover:text-gray-300">About Us</button>
          <button onClick={() => setActiveSection("contactUs")} className="hover:text-gray-300">Contact Us</button>
        </div>
      </nav>

      {activeSection === "home" && (
        <div className="min-h-screen flex flex-col items-center justify-center text-white text-center px-4 w-full">
          <h1 className="text-4xl md:text-5xl text-white font-bold mt-12">Welcome to <br /> Bug Tracker!</h1>
          <p className="mt-4 text-lg md:text-xl">
            <strong>New Here?</strong> <br />
            Bug Tracker is a centralized platform for development teams to track, manage, and resolve bugs efficiently. 
            <span className="font-bold">Join Now!</span>
          </p>
          <button onClick={handleLetsGo} className="mt-6 px-6 py-3 bg-purple-900 hover:bg-purple-800 text-white text-lg font-semibold rounded-lg shadow-md transition">
            Let’s Go!
          </button>
          <img src="/bug.png" alt="Ladybug" className="absolute bottom-0 left-0 w-40 md:w-52" />
        </div>
      )}

      {activeSection === "aboutUs" && (
        <div ref={aboutUsRef} className="min-h-screen flex flex-col items-center justify-center w-full bg-purple-800 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold">About Us</h2>
          <p className="mt-4 max-w-2xl mx-auto">
            Bug Tracker is designed to help development teams manage and resolve bugs efficiently, ensuring smooth project workflow and improved productivity.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-purple-600">AI Bug Assignment</h3>
              <p className="text-gray-500 text-sm">Smart AI assigns bugs to the right developers.</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-purple-600">Real-Time Analytics</h3>
              <p className="text-gray-500 text-sm">Track bug resolution status with live data.</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-purple-600">Role-Based Access</h3>
              <p className="text-gray-500 text-sm">Secure access based on user roles.</p>
            </div>
          </div>
        </div>
      )}

      {activeSection === "contactUs" && (
        <div ref={contactUsRef} className="min-h-screen flex flex-col items-center justify-center w-full bg-purple-900 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="mt-4 max-w-2xl mx-auto">
            Need support or have inquiries? Reach out to our team at <strong>support@bugtracker.com</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
