import React, { useState, useEffect } from "react";

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // faster buggie!
      });
    }, 30); // smoother & quicker

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-b from-purple-400 to-purple-700">
      <div className="text-center w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-purple-700 text-3xl font-bold mb-6">
          Getting things ready...
        </h2>

        {/* Progress Bar */}
        <div className="relative w-full h-6 bg-purple-200 rounded-full overflow-hidden">
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 h-full bg-purple-500 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>

          {/* Buggie icon */}
          <div
            className="absolute top-0 h-full flex items-center transition-all duration-100"
            style={{ left: `${progress}%`, transform: "translateX(-60%)" }}
          >
            <img
              src="/bug.png"
              alt="Ladybug"
              className="w-12 h-12 animate-bounce-slow"
            />
          </div>
        </div>

        {/* Progress Text */}
        <p className="text-purple-700 mt-4 text-lg font-semibold">
          {progress}%
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
