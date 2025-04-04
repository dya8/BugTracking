//logout
import { useNavigate } from  "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LogoutPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (Example: localStorage.clear())
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-700">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-lg shadow-lg w-96 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Goodbye!</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-center gap-4">
          <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={handleLogout}>
            Logout
          </Button>
          <Button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LogoutPage;