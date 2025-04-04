import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import Sidebar from "./Sidebar"; 
import { FaSearch, FaBell, FaUser } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 

export default function ManageUsers() {
  const [users, setUsers] = useState([{ email: "", role: "" }]);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const managerId = 1; // Replace with dynamic manager ID if needed
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectUsers = async () => {
      setLoading(true);
      try {
        console.log("Fetching project_id for manager_id:", managerId);

        // Step 1: Get project_id from the Manager table
        const projectResponse = await fetch(`http://localhost:3000/api/manager/${managerId}`);
        const projectData = await projectResponse.json();

        if (!projectResponse.ok || !projectData.project_id) {
          console.error("Failed to fetch project_id", projectData);
          setLoading(false);
          return;
        }

        const projectId = projectData.project_id;
        console.log("Fetched project_id:", projectId);

        // Step 2: Fetch developers and testers using project_id
        const devResponse = await fetch(`http://localhost:3000/api/developers?project_id=${projectId}`);
        const testerResponse = await fetch(`http://localhost:3000/api/testers?project_id=${projectId}`);
        
        const devData = await devResponse.json();
        const testerData = await testerResponse.json();

        console.log("Fetched Developers:", devData);
        console.log("Fetched Testers:", testerData);

        if (devResponse.ok && testerResponse.ok) {
          const formattedUsers = [...devData, ...testerData].map(user => ({
            id: user.id, 
            name: user.name, 
            role: user.role
          }));
          setFetchedUsers(formattedUsers);
        } else {
          console.error("Unexpected data format", devData, testerData);
          setFetchedUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users", error);
        setFetchedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectUsers();
  }, [managerId]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="flex justify-between items-center p-4 bg-white shadow-md">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-2 py-1 border rounded-md"
              />
            </div>
            <FaBell className="text-purple-700 cursor-pointer" onClick={() => navigate("/notifications")} />
            <div className="flex items-center space-x-2 text-purple-700 cursor-pointer">
              <span>Admin</span>
              <FaUser className="text-purple-700" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <header className="flex justify-between items-center bg-white p-3 shadow-md rounded-lg">
            <h2 className="text-lg font-semibold">Manage Users</h2>
          </header>

          <div className="mt-5 bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Project Users</h2>
            {loading ? (
              <p className="text-gray-500">Loading users...</p>
            ) : fetchedUsers.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <table className="min-w-full border border-gray-300">
                <thead className="bg-purple-200">
                  <tr>
                    <th className="p-3 border">User Name</th>
                    <th className="p-3 border">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchedUsers.map((user, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="p-3 border">{user.name}</td>
                      <td className="p-3 border">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
