import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLetsGo = () => {
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white text-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundColor: "#6B46C1",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "multiply",
        cursor: `url('/bug.png'), auto`,
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/70 via-purple-900/60 to-purple-800/80 z-0" />

      {/* Main Content */}
      <motion.div
        className="z-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg glow-text">
          Welcome to <br /> Bug Tracker!
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl leading-relaxed opacity-95">
          <strong className="font-semibold">New Here?</strong> <br />
          Bug Tracker is a centralized platform for development teams to track, manage,
          and resolve bugs efficiently.{" "}
          <span className="font-bold bg-purple-800/70 px-2 py-1 rounded-lg shadow-md inline-block">
            Join Now!
          </span>
        </p>

        <motion.button
          onClick={handleLetsGo}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-3 bg-purple-900 hover:bg-purple-800 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500/50 animate-pulse"
          style={{ cursor: `url('/bug.png'), pointer` }}
        >
          Let’s Go!
        </motion.button>
      </motion.div>

      {/* Animated Bug Image */}
      <motion.img
  src="/bug.png"
  alt="Ladybug"
  className="absolute bottom-4 left-4 w-32 md:w-40 z-10 origin-bottom-left"
  animate={{
    y: [0, -6, 0],
    rotate: [0, 1, -1, 0],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  whileHover={{
    scale: 1.2,
    rotate: -10,
    transition: { type: "spring", stiffness: 300 },
  }}
/>

    </div>
  );
};

export default WelcomePage;
