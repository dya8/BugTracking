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
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-b from-purple-400 to-purple-700">
      <div className="text-center w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-purple-700 text-2xl font-semibold mb-4">
          Getting things ready...
        </h2>

        {/* Progress Bar */}
        <div className="relative w-full h-6 bg-purple-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 h-full bg-purple-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
          <div
            className="absolute left-0 top-0 h-full flex items-center transition-transform duration-100"
            style={{ left: `${progress}%`, transform: "translateX(-60%)" }}
          >
            <img src="/bug.png" alt="Ladybug" className="w-14 h-16" />
          </div>
        </div>

        <p className="text-purple-700 mt-2 font-medium">{progress}%</p>
      </div>
    </div>
  );
};

export default LoadingPage;
