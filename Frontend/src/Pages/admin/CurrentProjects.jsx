import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function BugTracking() {
  const [showModal, setShowModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Function to add a team member
  const addTeamMember = () => {
    if (email && role) {
      setTeamMembers([...teamMembers, { email, role }]);
      setEmail("");
      setRole("");
    }
  };

  // Function to send email
  const sendEmail = async () => {
    if (!teamMembers.length) {
      setMessage("Please add at least one team member.");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectManager: projectManager || "Some Name", // Use input or fallback
          teamMembers,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        setMessage("Emails sent successfully!");
        
        // Close modal after 2 seconds and reset everything
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        setMessage("Failed to send email. Please try again.");
      }
    } catch (error) {
      setMessage("Error sending email.");
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the form when closing the modal
  const resetForm = () => {
    setShowModal(false);
    setTeamMembers([]);
    setProjectManager("");
    setEmail("");
    setRole("");
    setMessage(""); // Reset message when modal is closed
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar setShowModal={setShowModal} />

        {/* Project Card */}
        <div className="border space-y-5 text-left pt-4 rounded-lg shadow-md w-64 p-4 mt-[10px]">
          <h3 className="font-bold">Project One</h3>
          <p>📋 Manage team</p>
          <p>📅 Due date</p>
          <p>Pending bugs: 3</p>
          <p>Completed bugs: 4</p>
          <p>Project manager: {projectManager || "Name"}</p>
          <p>Last updated</p>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96 relative">
              <button className="absolute top-2 right-2" onClick={resetForm}>
                <IoMdClose size={20} />
              </button>
              <h3 className="text-lg font-bold">Add Project</h3>
              <input
                type="text"
                placeholder="Project Manager Name"
                value={projectManager}
                onChange={(e) => setProjectManager(e.target.value)}
                className="border w-full p-2 mt-2 bg-white"
              />
              <div className="mt-4">
                <h4 className="font-semibold">Add team members</h4>
                <div className="flex space-x-2 mt-2 bg-white p-2 rounded-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="border p-2 flex-1"
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-2 py-2 border-2 border-purple-500 text-purple-500 bg-transparent rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="Developer">Developer</option>
                    <option value="Tester">Tester</option>
                    <option value="Manager">Project Manager</option>
                  </select>
                </div>
                <button
                  className="mt-2 text-white bg-purple-700 hover:bg-purple-600 p-2 rounded-md"
                  onClick={addTeamMember}
                >
                  Add another
                </button>
                <ul className="mt-2">
                  {teamMembers.map((member, index) => (
                    <li key={index} className="flex justify-between p-2 border rounded-md mt-1">
                      {member.email} - {member.role}
                      <button
                        className="text-red-500"
                        onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== index))}
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md w-full"
                onClick={sendEmail}
                disabled={loading}
              >
                {loading ? "Sending..." : "Confirm"}
              </button>
              {message && <p className="text-center text-sm mt-2">{message}</p>} 
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
