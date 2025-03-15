import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";


const BugDetailsM = () => {
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Dummy bug data (Replace with API data if fetching from backend)
  const [bugs] = useState([
    { id: 1, name: "Login Issue", project: "Website", assignedTo: "Dev A", status: "In Progress", priority: "High", dueDate: "March 15, 3:00 PM" },
    { id: 2, name: "Page Crash", project: "Mobile App", assignedTo: "Dev B", status: "Verified", priority: "Medium", dueDate: "March 18, 12:30 PM" },
    { id: 3, name: "UI Glitch", project: "Dashboard", assignedTo: "Dev C", status: "Resolved", priority: "Low", dueDate: "March 20, 6:45 PM" },
    { id: 4, name: "API Timeout", project: "Backend", assignedTo: "Dev D", status: "Stuck", priority: "High", dueDate: "March 22, 10:15 AM" }
  ]);

  // Select the bug with id 4 (Change logic to dynamically get bug details in real use case)
  const { bugId } = useParams();
  const bug = bugs.find((b) => b.id === 4);

  if (!bug) {
    return <div className="text-center text-red-500">Bug not found!</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dueDate) {
      alert("Due date is required!");
      return;
    }
    if (!selectedDeveloper) {
      alert("Reassign to field is required!");
      return;
    }
    console.log("Bug updated:", { selectedDeveloper, dueDate });
    // TODO: Send update request to backend
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content with Navbar */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Bug Details Section */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-10">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
            <button className="bg-purple-600 text-white px-3 py-1 rounded mb-4">
              ← Back to Bugs
            </button>

            {/* Centered Bug Name */}
            <h2 className="text-xl font-bold text-purple-800 flex items-center justify-center gap-2">
              🐞 {bug.name}
            </h2>

            <p><strong>Project:</strong> <span className="text-gray-700">{bug.project}</span></p>
            <p><strong>Assigned to:</strong> <span className="text-gray-800">{bug.assignedTo}</span></p>
            <p><strong>Priority:</strong> <span className="text-red-500 font-semibold">{bug.priority}</span></p>
            <p><strong>Bug Status:</strong> <span className="text-red-500">{bug.status}</span></p>
            <p><strong>Due Date:</strong> <span className="text-gray-700">{bug.dueDate}</span></p>

            {/* Show form only if bug status is "Stuck" */}
            {bug.status === "Stuck" && (
              <form onSubmit={handleSubmit} className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
                {/* Reassign Dropdown (Optional) */}
                <label className="block text-purple-700 font-semibold mb-1">Reassign to (Required):</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white text-black"
                  value={selectedDeveloper}
                  onChange={(e) => setSelectedDeveloper(e.target.value)}
                >
                  <option value="">Select Developer</option>
                  <option value="Dev A">Dev A</option>
                  <option value="Dev B">Dev B</option>
                  <option value="Dev C">Dev C</option>
                  <option value="Dev D">Dev D</option>
                </select>

                {/* Extend Due Date (Required) */}
                <label className="block text-purple-700 font-semibold mb-1">Extend due (Required):</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white text-black"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />

                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded w-full">
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugDetailsM;
