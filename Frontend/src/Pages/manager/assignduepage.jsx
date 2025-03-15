import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const AssignDuePage = () => {
  const { bugId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  const handleAssignDue = () => {
    // Simulate assignment logic (replace with your actual API call)
    if (selectedDate) {
      // Your API call to assign the due date would go here
      console.log("Assigning due date:", selectedDate);

      // Simulate success
      setAssignmentSuccess(true);
      // Clear the success message after a few seconds
      setTimeout(() => {
        setAssignmentSuccess(false);
      }, 3000); // 3 seconds
    } else {
      alert("Please select a due date and time.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-purple-700">Assign Due</h2>
          <p className="text-gray-600">Bug ID: {bugId}</p>
          <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
            <p>
              <strong>Bug name:</strong> Login Issue
            </p>
            <p>
              <strong>Project name:</strong> Website
            </p>
            <p>
              <strong>Priority:</strong> High
            </p>
            <p>
              <strong>Assigned to:</strong> Developer A
            </p>
            <p>
              <strong>Assigned on:</strong> 2025-03-15
            </p>
            <p>
              <strong>Bug status:</strong> Stuck
            </p>

            <div className="mt-4">
              <label className="block text-purple-700 font-bold">
                Assign due:
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                dateFormat="Pp"
                className="border p-2 w-full mt-1"
              />
            </div>

            <button
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-800"
              onClick={handleAssignDue}
            >
              Assign
            </button>
            {assignmentSuccess && (
              <div className="mt-2 text-green-600">
                Bug due assigned successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDuePage;