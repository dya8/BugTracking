import React from "react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center">
      <div className="max-w-3xl bg-white p-8 rounded-lg shadow-lg text-center">
        {/* Header */}
        <h1 className="text-3xl font-bold text-purple-700">About Bug Tracker</h1>
        <p className="mt-2 text-gray-600">
          Bug Tracker is a centralized platform that helps development teams efficiently track, manage, and resolve bugs.
        </p>

        {/* Features Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Contact Section */}
        <div className="mt-6">
          <p className="text-gray-600">Need help? <a href="#" className="text-purple-600 font-medium">Contact Us</a></p>
        </div>
      </div>
    </div>
  );
}