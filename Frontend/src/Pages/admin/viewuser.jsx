import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar"; // Import Sidebar
import Navbar from "./navbar"; // Import Navbar

export default function ViewUser() {
  const { userId, role } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log("Fetching user details for ID:", userId, "Role:", role); // Debugging
        const response = await fetch(`http://localhost:3000/api/userr/${userId}?role=${role}`);
        const data = await response.json();
        console.log("fetched data:",data);

        if (response.ok) {
          setUser(data);
        } else {
          console.error("Error fetching user:", data.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    if (userId && role) fetchUserDetails();
  }, [userId, role]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar /> {/* Sidebar on the left */}
      <div className="flex flex-col w-full">
        <Navbar /> {/* Navbar at the top */}
        <div className="flex flex-col items-center justify-center flex-1 p-5">
          <Card className="w-[400px] shadow-lg rounded-xl bg-white">
            <CardContent className="p-5">
              <h2 className="text-xl font-semibold mb-4">User Details</h2>
              {user ? (
                <div className="text-gray-700 space-y-2">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Project Name:</strong> {user.project_names}</p>
                </div>
              ) : (
                <p>Loading user details...</p>
              )}
              <div className="flex justify-between mt-4">
                <Button className="bg-purple-500 text-white hover:bg-gray-600" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
