const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { connectDB, Company, Admin, Project, Developer, Tester, Bug, Chatroom, ProjectManager} = require("./db"); // Import database setup and models
const chatRoutes = require("./routes/chatRoutes");
const {setupChatSocket} = require("./sockets/chatSocket");
const { Server } = require("socket.io");

const app = express();
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // 👈 Your React frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/chat", chatRoutes);

// Connect to MongoDB
connectDB();
setupChatSocket(io);

// Generate Unique ID
const counterSchema = new mongoose.Schema({
    entity: { type: String, required: true }, // Company, Admin, Developer, Tester, etc.
    count: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

const generateUniqueId = async (entity) => {
    const counter = await Counter.findOneAndUpdate(
        { entity },
        { $inc: { count: 1 } }, // Increment count
        { new: true, upsert: true}
    );

    let uniqueId = counter.count; 
    let exists = await Project.findOne({ project_id: uniqueId });

    while (exists) {
        uniqueId += 1;
        exists = await Project.findOne({ project_id: uniqueId });
    }

    return uniqueId;
};

//General login API
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Check if user exists in Admin collection
        let user = await Admin.findOne({ email });
        let role = "Admin";

        if (!user) {
            // Step 2: Check in Developer collection
            user = await Developer.findOne({ email });
            role = "Developer";
        }
        
        if (!user) {
            // Step 3: Check in Tester collection
            user = await Tester.findOne({ email });
            role = "Tester";
        }

        if (!user) {
            // Step 4: Check in Project Manager collection
            user = await ProjectManager.findOne({ email });
            role = "Project Manager";
        }

        if (!user) {
            return res.status(400).json({ error: "Invalid email or password!" });
        }

        // Step 5: Check if password is correct
        const isMatch = password === user.password; // If using bcrypt: await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password!" });
        }

        // Step 6: Send response with user role
        res.status(200).json({ message: "Login successful!", role });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ Company Signup API (No changes)
app.post("/api/company-signup", async (req, res) => {
    try {
        const { company_name, email } = req.body;

        // ✅ Validate input
        if (!company_name || !email) {
            return res.status(400).json({ message: "Company name and email are required." });
        }

        // ✅ Check if company already exists
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: "Company with this email already exists!" });
        }

        // ✅ Generate a unique company_id 
        const company_id = (await generateUniqueId("Company"));

        // ✅ Create a new company record
        const company = new Company({ company_id, company_name, email });

        await company.save();

        res.status(201).json({ 
            message: "Company Registered Successfully", 
            company_id 
        });

    } catch (error) {
        console.error("Company Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ Get Company Details API
app.post("/api/get-company-details", async (req, res) => {
    try {
      const { companyName } = req.body;  // Get companyName from request body
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required." });
      }
  
      const company = await Company.findOne({ company_name: companyName });  // Search by company_name
  
      if (!company) {
        return res.status(404).json({ message: "Company not found. Please register first." });
      }
  
      res.status(200).json({ 
        company_id: company.company_id,
        company_name: company.company_name 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

app.post("/api/bugs/report", async (req, res) => {  
    try {
        console.log("Request Body:", req.body);
        const { bug_name, bug_type,bug_status, priority, assigned_to, project_id, description, comments, reported_by,due } = req.body;
        
        console.log(typeof req.body.bug_name, typeof req.body.bug_type, typeof req.body.reported_by);

        // 🔹 Get the next bug_id from the counter collection
        const counter = await Counter.findOneAndUpdate(
            { entity:"Bug" }, // Unique identifier for bug_id counter
            { $inc: { count: 1 } }, // Increment the counter
            { new: true, upsert: true } // Create if it doesn't exist
        );

        
        // 🔹 Convert `due_date` to Date object
        const parsedDueDate = due ? new Date(due) : null;
        if (parsedDueDate && isNaN(parsedDueDate.getTime())) {
            return res.status(400).json({ message: "Invalid due_date format", received: due });
        }

        const newBug = new Bug({
            bug_id: counter.count,  // Assign incremented bug_id
            bug_name,
            bug_status,  
            bug_type,
            priority,
            assigned_to,
            project_id,
            description,
            comments,
            reported_by,
            due:parsedDueDate
        });

        await newBug.save();
        res.status(201).json({ message: "Bug reported successfully", bug: newBug });
    } catch (error) {
        console.error("Error reporting bug:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//assigned bugs of developer
app.get("/api/bugs/assigned", async (req, res) => {
    try {
        const developerId = 1; // TODO: Replace with actual logged-in developer ID

        if (!developerId) {
            return res.status(400).json({ message: "Developer ID is required" });
        }

        // Fetch bugs assigned to the developer with specific statuses
        const bugs = await Bug.find({
            assigned_to: developerId,
            bug_status: { $in: ["Open", "Reopen", "In Progress"] },
        });

        // Get unique project IDs
        const projectIds = [...new Set(bugs.map(bug => bug.project_id))];

        // Fetch project details
        const projects = await Project.find({ project_id: { $in: projectIds } }).lean();
        const projectNames = {};
        projects.forEach(project => {
            projectNames[project.project_id] = project.project_name;
        });

        // Get unique tester IDs
        const testerIds = [...new Set(bugs.map(bug => bug.reported_by))];

        // Fetch tester details
        const testers = await Tester.find({ tester_id: { $in: testerIds } }).lean();
        const testerNames = {};
        testers.forEach(tester => {
            testerNames[tester.tester_id] = tester.tester_name;
        });

        // Format the response correctly
        const formattedBugs = bugs.map(bug => ({
            bug_id: bug.bug_id,
            bug_name: bug.bug_name,
            project_name: projectNames[bug.project_id] || "Unknown Project",
            assigned_by: testerNames[bug.reported_by] || "Unknown Tester",
            bug_status: bug.bug_status,
            priority: bug.priority,
            due: bug.due ? new Date(bug.due).toISOString() : null // ✅ Send as ISO date
        }));

        res.json(formattedBugs); // ✅ Send the correctly formatted response
    } catch (error) {
        console.error("Error fetching assigned bugs:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//fetch bug details for developer
app.get("/api/bugs/:id", async (req, res) => {
    try {
        const bug = await Bug.findOne({ bug_id: Number(req.params.id) }).lean();

        if (!bug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        console.log("Fetched Bug:", bug); // Debugging

        // Fetch project details
        const project = await Project.findOne({ project_id: Number(bug.project_id) }).lean();

        if (!project) {
            console.log(`Project with ID ${bug.project_id} not found`);
        }

        console.log("Fetched Project:", project); // Debugging

        // Send response with project_name
        res.json({
            ...bug,
            project_name: project ? project.project_name : "Unknown Project"
        });
    } catch (error) {
        console.error("Error fetching bug:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Start working on a bug
app.put("/api/bugs/:id/start", async (req, res) => {
    try {
        await Bug.updateOne({ bug_id: req.params.id }, { bug_status: "In Progress" });
        res.json({ message: "Bug status updated to In Progress" });
    } catch (error) {
        console.error("Error updating bug:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Resolve a bug
app.put("/api/bugs/resolve/:id", async (req, res) => {
    try {
        const { resolved_at } = req.body;
      const bug = await Bug.findOneAndUpdate(
        { bug_id: Number(req.params.id) },
        { bug_status: "Resolved",resolved_at },
        { new: true } // This ensures we get the updated bug back
      );
  
      if (!bug) return res.status(404).json({ message: "Bug not found" });
  
      res.json({ message: "Bug resolved successfully", bug });
    } catch (error) {
      console.error("Error resolving bug:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

// Mark bug as Stuck
app.put("/api/bugs/:id/stuck", async (req, res) => {
    try {
      const bug = await Bug.findOneAndUpdate(
        { bug_id: Number(req.params.id) },
        { bug_status: "Stuck" },
        { new: true }
      );
  
      if (!bug) return res.status(404).json({ message: "Bug not found" });
  
      res.json({ message: "Bug marked as Stuck", bug });
    } catch (error) {
      console.error("Error updating bug to Stuck:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  

app.get("/api/bugs",async(req,res) => {
    try{
        const testerId = 1;
        
    if (!testerId) {
        return res.status(400).json({ message: "Tester ID is required" });
      }
  
      // Fetch all bugs reported by this tester
      const bugs = await Bug.find({ reported_by: testerId });
      const projectIds = [...new Set(bugs.map(bug => Number(bug.project_id)))]; // Unique project IDs
      const projects = await Project.find({ project_id: { $in: projectIds } }).lean();
  
      // Create a lookup object for project names
      const projectNames = {};
      projects.forEach(project => {
        projectNames[project.project_id] = project.project_name;
      });
    
      const formattedBugs = bugs.map((bug) => ({
        bug_id: bug.bug_id,
        bug_name: bug.bug_name,
        project_name: projectNames[Number(bug.project_id)] || "Unknown Project",
        assigned_to: bug.assigned_to,
        bug_status: bug.bug_status,
        priority: bug.priority,
        due:bug.due
      }));
  
      res.json(formattedBugs);
    } catch (error) {
      console.error("Error fetching bugs:", error);
      res.status(500).json({ message: "Server error" });
    }
    } );

app.get("/api/tester/projects", async (req, res) => {
    try {
        const testerId = 1;
        if (isNaN(testerId)||!testerId) {
            return res.status(404).json({ error: "Tester not found" });
        }
        // Find all bugs reported by this tester
        const bugs = await Bug.find({ reported_by: testerId});
        console.log("Bugs found:", bugs); // Debugging log
        if (bugs.length === 0) {
            return res.json({ projects: [] }); // No projects found if no bugs exist
        }
        // Extract unique project IDs
        const projectIds = [...new Set(bugs.map(bug => bug.project_id))];
        
        // Fetch project details
        const projects = await Project.find({ project_id: { $in: projectIds } }, "project_id project_name");
        console.log("Projects found:", projects); 
        // Format response
        const projectData = projects.map(project => ({
            id: project.project_id,
            name: project.project_name
        }));

        res.json({ projects: projectData });
    } catch (error) {
        console.error("Error fetching tester's projects:", error);
        res.status(500).json({ error: "Server error" });
    }
});
//testers verify bugs extraction
app.get("/api/resolved/:testerId", async (req, res) => {
    try {
        const testerId = parseInt(req.params.testerId);
        console.log("Received request for testerId:", testerId);

        if (isNaN(testerId)) {
            console.error("Invalid tester ID received");
            return res.status(400).json({ error: "Invalid tester ID" });
        }

        // Fetch tester details
        const tester = await Tester.findOne({ tester_id: testerId });
        if (!tester) {
            console.log("Tester not found");
            return res.status(404).json({ error: "Tester not found" });
        }
        console.log("Tester found:", tester);

        // Fetch all resolved bugs reported by the tester
        const resolvedBugs = await Bug.find({ bug_status: "Resolved", reported_by: testerId });

        if (!resolvedBugs || resolvedBugs.length === 0) {
            console.log("No resolved bugs found for this tester");
            return res.status(404).json({ message: "No resolved bugs reported by this tester", tester_name: tester.tester_name });
        }

        console.log("Resolved bugs found:", resolvedBugs);

        // Extract unique project IDs and developer IDs
        const projectIds = [...new Set(resolvedBugs.map(bug => bug.project_id).filter(id => id))];
        const developerIds = [...new Set(resolvedBugs.map(bug => bug.assigned_to).filter(id => id))];

        console.log("Unique project IDs:", projectIds);
        console.log("Unique developer IDs:", developerIds);

        // Fetch all projects in a single query
        const projects = await Project.find({ project_id: { $in: projectIds } });
        const developers = await Developer.find({ developer_id: { $in: developerIds } });

        // Create lookup dictionaries
        const projectMap = {};
        projects.forEach(project => {
            projectMap[project.project_id] = project.project_name;
        });

        const developerMap = {};
        developers.forEach(dev => {
            developerMap[dev.developer_id] = dev.developer_name;
        });

        console.log("Project mapping:", projectMap);
        console.log("Developer mapping:", developerMap);

        // Attach project names and developer names to bugs
        const bugsWithDetails = resolvedBugs.map(bug => ({
            bug_id: bug.bug_id,
            bug_name: bug.bug_name,
            project_name: projectMap[bug.project_id] || "N/A",
            assigned_to: developerMap[bug.assigned_to] || "Unknown Developer",  // 🔥 FIX: This now fetches Developer Name!
            bug_status: bug.bug_status,
            priority: bug.priority,
            resolved_at: bug.resolved_at,
        }));

        console.log("Final response data:", {bugs: bugsWithDetails });
        res.json({ bugs: bugsWithDetails });
    } catch (err) {
        console.error("Error fetching bugs:", err.message);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});
//tester verify bug details api
app.get("/api/verifybugs/:bugId", async (req, res) => {
    try {
      const bugId = parseInt(req.params.bugId);
      if (isNaN(bugId)) {
        return res.status(400).json({ message: "Invalid bug ID" });
      }
  
      // Fetch the bug details
      const bug = await Bug.findOne({ bug_id: bugId });
  
      if (!bug) {
        return res.status(404).json({ message: "Bug not found" });
      }
  
      // Fetch project details
      const project = await Project.findOne({ project_id: bug.project_id });
      const projectName = project ? project.project_name : "N/A";
  
      // Fetch developer details
      const developer = await Developer.findOne({ developer_id: bug.assigned_to });
      const developerName = developer ? developer.developer_name : "Unknown Developer";
  
      // Construct the response object
      const bugDetails = {
        bug_id: bug.bug_id,
        bug_name: bug.bug_name,
        project_name: projectName,
        assigned_to: developerName,
        bug_status: bug.bug_status,
        priority: bug.priority,
        resolved_at: bug.resolved_at,
      };
  
      res.json({ bug: bugDetails });
    } catch (error) {
      console.error("Error fetching bug details:", error.message);
      res.status(500).json({ message: "Internal Server Error", details: error.message });
    }
  });
  //tester verify bug update status
  app.patch("/api/bugs/:bugId/update-status", async (req, res) => {
    try {
      const bugId = parseInt(req.params.bugId);
      const { newStatus } = req.body; // Expecting "Verified" or "Reopen"
  
      if (isNaN(bugId)) {
        return res.status(400).json({ message: "Invalid bug ID" });
      }
  
      if (!["Verified", "Reopen"].includes(newStatus)) {
        return res.status(400).json({ message: "Invalid status update" });
      }
  
      // Update the bug status
      const updatedBug = await Bug.findOneAndUpdate(
        { bug_id: bugId },
        { $set: { bug_status: newStatus } },
        { new: true }
      );
  
      if (!updatedBug) {
        return res.status(404).json({ message: "Bug not found" });
      }
  
      res.json({ message: `Bug status updated to ${newStatus}`, bug: updatedBug });
    } catch (error) {
      console.error("Error updating bug status:", error.message);
      res.status(500).json({ message: "Internal Server Error", details: error.message });
    }
  });
  //proj manager track bugs
  app.get("/api/bugs/projmanager/:projectManagerId", async (req, res) => {
    try {
        const projectManagerId = parseInt(req.params.projectManagerId);

        if (isNaN(projectManagerId)) {
            return res.status(400).json({ message: "Invalid Project Manager ID" });
        }

        // 🔹 Fetch Project Manager details correctly
        const projectManager = await ProjectManager.findOne({ manager_id: projectManagerId });

        if (!projectManager || !projectManager.project_id.length) {
            return res.status(404).json({ message: "No projects found for this Project Manager" });
        }

        const projectIds = projectManager.project_id; // This is an array of project IDs

        // 🔹 Fetch all bugs related to these projects
        const bugs = await Bug.find({ project_id: { $in: projectIds } });

        if (!bugs.length) {
            return res.status(404).json({ message: "No bugs found for these projects" });
        }

        // 🔹 Fetch additional details for each bug
        const detailedBugs = await Promise.all(
            bugs.map(async (bug) => {
                if (!bug.bug_id || isNaN(bug.bug_id)) {
                    console.error("Invalid bug ID found:", bug);
                    return null; // Skip invalid bugs
                }

                const project = await Project.findOne({ project_id: bug.project_id });
                const tester = await Tester.findOne({ tester_id: bug.reported_by });
                // Fetch developer details
                const developer = await Developer.findOne({ developer_id: bug.assigned_to });
                const developerName = developer ? developer.developer_name : "Unknown Developer";
                console.log("Developer Found:", developer);

                return {
                    bug_id: Number(bug.bug_id), // Ensure it's a number
                    bug_name: bug.bug_name,
                    project_name: project ? project.project_name : "N/A",
                    bug_status: bug.bug_status,
                    priority: bug.priority,
                    due: bug.due || "No Due Date",
                    resolved_at: bug.resolved_at || "Not Resolved",
                    assigned_to: developerName,
                    tester_name: tester ? tester.tester_name : "Unknown Tester",
                };
            })
        );

        res.status(200).json(detailedBugs.filter((bug) => bug !== null));
    } catch (error) {
        console.error("Error fetching bugs:", error);
        res.status(500).json({ message: "Server error while fetching bugs", error: error.message });
    }
});
// Get details of a specific bug for manager
app.get("/api/bugsM/:bugId", async (req, res) => {
    try {
        const bugId = Number(req.params.bugId); // Convert to number
        if (isNaN(bugId)) {
            return res.status(400).json({ error: "Invalid bug ID" });
        }

        // 🔹 Fetch bug details
        const bug = await Bug.findOne({ bug_id: bugId });

        if (!bug) {
            return res.status(404).json({ error: "Bug not found" });
        }

        // 🔹 Fetch project details
        const project = await Project.findOne({ project_id: bug.project_id });

        // 🔹 Fetch assigned developer details
        const developer = await Developer.findOne({ developer_id: bug.assigned_to });

        // 🔹 Fetch tester details
        const tester = await Tester.findOne({ tester_id: bug.reported_by });

        // 🔹 Prepare the response object
        const bugDetails = {
            bug_id: bug.bug_id,
            bug_name: bug.bug_name,
            project_id: bug.project_id,
            project_name: project ? project.project_name : "Unknown Project",
            bug_status: bug.bug_status,
            priority: bug.priority,
            due: bug.due || "No Due Date",
            resolved_at: bug.resolved_at || "Not Resolved",
            assigned_to: developer ? developer.developer_name : "Unassigned",
            description: bug.description || "No description available",
            severity: bug.severity || "Unknown",
            reported_by: tester ? tester.tester_name : "Unknown Tester",
        };
        console.log(bugDetails);
        res.status(200).json(bugDetails);
    } catch (error) {
        console.error("Error fetching bug details:", error);
        res.status(500).json({ error: "Server error" });
    }
});

//stuck bugs
app.put("/api/bugsM/:bugId/update", async (req, res) => {
    try {
      const bugId = Number(req.params.bugId);
      if (isNaN(bugId)) {
        return res.status(400).json({ error: "Invalid bug ID" });
      }
  
      const { dueDate, assignedTo } = req.body;
      const updatedBug = await Bug.findOneAndUpdate(
        { bug_id: bugId }, 
        { due: dueDate, assigned_to: assignedTo,bug_status: "Reopen" }, 
        { new: true }
      );
  
      if (!updatedBug) {
        return res.status(404).json({ error: "Bug not found" });
      }
  
      res.json({ message: "Bug updated successfully!", updatedBug });
    } catch (error) {
      console.error("Error updating bug:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
//fetch dev names for stuck bugs
app.get("/api/projects/:projectId/developers", async (req, res) => {
    const projectId = req.params.projectId;
    try {
      const developers = await Developer.find({ project_id: projectId });
      res.json(developers);
    } catch (error) {
      res.status(500).json({ error: "Error fetching developers" });
    }
  });  
  
//admin managerusers
app.get("/api/users/:adminId", async (req, res) => {
    try {
        console.log("Raw Admin ID from request:", req.params.adminId);
        const adminId = Number(req.params.adminId);
        console.log("Admin ID received:", adminId);

        // Find the admin and get company_id
        const admin = await Admin.findOne({ admin_id: adminId });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const companyId = admin.company_id;

        // Fetch all users belonging to the same company
        const projectManagers = await ProjectManager.find({ company_id: companyId })
            .select("manager_id manager_name");

        const testers = await Tester.find({ company_id: companyId })
            .select("tester_id tester_name");

        const developers = await Developer.find({ company_id: companyId })
            .select("developer_id developer_name");

        // Format the response with IDs
        const users = [
            ...projectManagers.map(user => ({
                id: user.manager_id||user.id, // Include the user ID
                name: user.manager_name,
                role: "Project Manager"
            })),
            ...testers.map(user => ({
                id: user.tester_id, // Include the user ID
                name: user.tester_name,
                role: "Tester"
            })),
            ...developers.map(user => ({
                id: user.developer_id, // Include the user ID
                name: user.developer_name,
                role: "Developer"
            }))
        ];
        
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});
//to delete users in admin manage users
app.delete("/api/users/:userId", async (req, res) => {
    try {
      const userId= Number(req.params.userId);
      const { role } = req.query;
  
      let deletedUser;
  
      if (role === "Developer") {
        deletedUser = await Developer.findOneAndDelete({ developer_id: userId });
      } else if (role === "Tester") {
        deletedUser = await Tester.findOneAndDelete({ tester_id: userId });
      } else if (role === "Project Manager") {
        deletedUser = await ProjectManager.findOneAndDelete({ manager_id: userId });
      } else {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
//Manage users in admin view button
app.get("/api/user/:id", async (req, res) => {
    const userId = Number(req.params.id); // ✅ Convert id to number
    const { role } = req.query; 

    try {
        let user;

        if (role === "Developer") {
            user = await Developer.aggregate([
                { $match: { developer_id: userId } },
                {
                    $lookup: {
                        from: "projects", // ✅ Your Project collection name (check your DB)
                        localField: "project_id",
                        foreignField: "project_id",
                        as: "projectDetails"
                    }
                }
            ]);
        } else if (role === "Tester") {
            user = await Tester.aggregate([
                { $match: { tester_id: userId } },
                {
                    $lookup: {
                        from: "projects",
                        localField: "project_id",
                        foreignField: "project_id",
                        as: "projectDetails"
                    }
                }
            ]);
        } else if (role === "Project Manager") {
            user = await ProjectManager.aggregate([
                { $match: { manager_id: userId } },
                {
                    $lookup: {
                        from: "projects",
                        localField: "project_id",
                        foreignField: "project_id",
                        as: "projectDetails"
                    }
                }
            ]);
        }

        if (!user || user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract user details
        const userData = user[0]; // Since aggregate returns an array

        res.json({
            name: userData.developer_name || userData.tester_name || userData.manager_name,
            email: userData.email,
            role,
            project_names: userData.projectDetails.length > 0 
                ? userData.projectDetails.map(project => project.project_name) 
                : ["Not Assigned"], // ✅ Return all project names as an array
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

  
app.get("/api/projects/:projectId/developers", async (req, res) => {
    try {
        const { projectId } = req.params;

        // Find all developers assigned to this project
        const developers = await Developer.find({ project_id: projectId });

        if (!developers.length) {
            return res.status(404).json({ message: "No developers found for this project" });
        }

        res.json({ developers });
    } catch (error) {
        console.error("Error fetching developers:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/* Fetch Tester Profile
app.get("/api/tester/profile", async (req, res) => {
    try {
        const tester = await Tester.findById(req.user.id); // Get tester from DB

        if (!tester) {
            return res.status(404).json({ error: "Tester not found" });
        }

        res.json({ testerId: tester._id, name: tester.name, email: tester.email }); // Return tester info
    } catch (error) {
        console.error("Error fetching tester profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});*/
app.post("/api/admin-signup", async (req, res) => {
    try {
        const { admin_name, email, password, company_name } = req.body;

        // ✅ Validate input
        if (!admin_name || !email || !password || !company_name) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // ✅ Fetch company details using company name
        const company = await Company.findOne({ company_name });
        if (!company) {
            return res.status(400).json({ message: "Company not found. Please register first." });
        }

        // ✅ Extract company ID (as a Number)
        const company_id = company.company_id; // Use company_id instead of _id

        // ✅ Generate unique admin ID
        const admin_id = await generateUniqueId("Admin");

        // ✅ Create new Admin entry
        const admin = new Admin({
            admin_id,
            admin_name,
            email,
            password, // Store hashed password
            company_id, // Store as a Number
        });

        await admin.save();

        res.status(201).json({ 
            message: "Admin Registered Successfully", 
            admin_id, 
            company_id 
        });

    } catch (error) {
        console.error("Admin Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Project Signup API
app.post("/api/project-signup", async (req, res) => {
    try {
        const { project_name, git_id, manager_name, email, company_name } = req.body;
       

        // Ensure company exists
        let company = await Company.findOne({ company_name });
    
        if (!company) {
            return res.status(400).json({ error: "Invalid company name. Company must be pre-registered." });
        }

        const company_id = company.company_id; // Get company's number id
        

        // Generate unique IDs
        const project_id = await generateUniqueId("Project");
        const manager_id = await generateUniqueId("ProjectManager");
     
        // Create and save the project
        const project = new Project({ project_id, project_name, git_id, company_id });
     
        await project.save();

        // Create and save the project manager
        const projectManager = new ProjectManager({
            manager_id,
            project_id,
            company_id,
            password: "defaultPassword123",
            manager_name,
            email,
            total_projects_handled: 1
        });
      
        await projectManager.save();

        res.status(201).json({ 
            message: "Project & Manager Registered Successfully", 
            project_id, 
            manager_id, 
            company_id 
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Team Signup API

app.post("/api/team-signup", async (req, res) => {
    try {
        const { collaborators, company_name ,project_name} = req.body;
        

        // Ensure company exists
        const company = await Company.findOne({ company_name });
        
        
        if (!company) {
            return res.status(400).json({ error: "Invalid company name. Company must be pre-registered." });
        }

        const company_id = company.company_id;
       
        if (!company_id) {
            return res.status(500).json({ error: "Company ID not found in database!" });
        }

        const project = await Project.findOne({project_name});
        
        const project_id = project.project_id;
       
        for (const collab of collaborators) {
            const { email, role } = collab;

            const user_id = await generateUniqueId(role);
            console.log(`Generated ID for ${role}:`, user_id);

            const password = "defaultPassword123";
            
            try {
                if (role === "Developer") {
                    const developer = new Developer({
                        developer_id: user_id,
                        developer_name: "Developer${user_id}",
                        email,
                        password,
                        company_id,
                        project_id
                    });
                    await developer.save();
                    
                } else if (role === "Tester") {
                    const tester = new Tester({
                        tester_id: user_id,
                        tester_name: "Tester${user_id}",
                        email,
                        password,
                        company_id,
                        project_id
                    });
                    await tester.save();
                    
                } else {
                    return res.status(400).json({ message: "Invalid role selected!" });
                }
            } catch (saveError) {
                console.error("Error saving user:", saveError);
                return res.status(500).json({ error: "Error saving user" });
            }
        }

        res.status(201).json({ message: "Team registered successfully!" });

    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ User Login API
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await Admin.findOne({ email }) || await Developer.findOne({ email }) || await Tester.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid Email or Password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Email or Password" });

        const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });

        res.status(200).json({ message: "Login Successful", token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// API to fetch projects for a specific developer without using populate
/*app.get('/api/projects/developer/:devid', async (req, res) => {
  // Convert developerid from URL params to a number
  const devid = Number(req.params.devid);
  console.log("devid:", devid);

  // Validate the developer ID
  if (isNaN(devid) || devid <= 0) {
    console.error(`Invalid developer ID received: ${devid}`);
    return res.status(400).json({ message: 'Invalid developer ID' });
  }

  console.log(`Received valid developer ID: ${devid}`);

  try {
    // Find the developer using their developer_id (fixed variable name from developerId to devid)
    const developer = await Developer.findOne({ developer_id: devid });

    if (!developer) {
      console.warn(`Developer not found for ID: ${devid}`);
      return res.status(404).json({ message: 'Developer not found' });
    }

    // Extract project IDs (handling both array and single value cases)
    const projectIds = Array.isArray(developer.project_id) 
      ? developer.project_id 
      : developer.project_id ? [developer.project_id] : [];

    if (projectIds.length === 0) {
      console.log(`No projects associated with developer ID: ${devid}`);
      return res.status(200).json([]); // Return empty array instead of 404
    }

    // Find projects using the project IDs
    const projects = await Project.find({ project_id: { $in: projectIds } });

    if (projects.length === 0) {
      console.log(`No matching project data found for project IDs: ${projectIds}`);
      return res.status(200).json([]); // Return empty array instead of 404
    }

    // Return the projects
    console.log(`Successfully fetched ${projects.length} projects for developer ID: ${devid}`);
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: error.message });
  }
});
  /*app.get('/api/projects/developer/:developerid', async (req, res) => {
    // Convert to number
    const devid = Number(req.params.developerid);
    console.log("devid:", devid);
  
    // Validate the developer ID
    if (isNaN(devid) || devid <= 0) {
      console.error(`Invalid developer ID received: ${devid}`);
      return res.status(400).json({ message: 'Invalid developer ID' });
    }
  
    console.log(`Received valid developer ID: ${devid}`);
  
    try {
      // Find the developer by developer_id
      const developer = await Developer.findOne({ developer_id: devid });
  
      if (!developer) {
        console.warn(`Developer not found for ID: ${devid}`);
        return res.status(404).json({ message: 'Developer not found' });
      }
  
      res.json(developer);
    } catch (error) {
      console.error('Error fetching developer:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  **/

  // API to fetch project details with manager info, total bugs, and bug statuses
app.get('/api/projects/developer/:devid', async (req, res) => {
  const devid = Number(req.params.devid);
  console.log("devid:", devid);

  if (isNaN(devid) || devid <= 0) {
    console.error(`Invalid developer ID received: ${devid}`);
    return res.status(400).json({ message: 'Invalid developer ID' });
  }

  try {
    // Find the developer by ID
    const developer = await Developer.findOne({ developer_id: devid });

    if (!developer) {
      console.warn(`Developer not found for ID: ${devid}`);
      return res.status(404).json({ message: 'Developer not found' });
    }

    const projectIds = Array.isArray(developer.project_id) 
      ? developer.project_id 
      : developer.project_id ? [developer.project_id] : [];

    if (projectIds.length === 0) {
      console.log(`No projects associated with developer ID: ${devid}`);
      return res.status(200).json([]);
    }

    // Fetch projects
    const projects = await Project.find({ project_id: { $in: projectIds } });

    // Fetch managers
    const managers = await ProjectManager.find({ project_id: { $in: projectIds } });

    // Fetch bugs with their status for each project
    const bugData = await Bug.find({ project_id: { $in: projectIds } }, 'project_id bug_name bug_status');

    // Aggregate bug count
    const bugCounts = await Bug.aggregate([
      { $match: { project_id: { $in: projectIds } } },
      { $group: { _id: "$project_id", total_bugs: { $sum: 1 } } }
    ]);

    // Map results
    const results = projects.map(project => {
      const manager = managers.find(mgr => mgr.project_id.includes(project.project_id));
      const totalBugs = bugCounts.find(b => b._id === project.project_id)?.total_bugs || 0;
      const bugs = bugData
        .filter(bug => bug.project_id === project.project_id)
        .map(bug => ({ bug_name: bug.bug_name, bug_status: bug.bug_status }));

      return {
        project_name: project.project_name,
        git_id: project.git_id,
        manager_name: manager ? manager.manager_name : "No Manager",
        total_bugs: totalBugs,
        bugs
      };
    });

    console.log(`Successfully fetched project details for developer ID: ${devid}`);
    res.json(results);
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: error.message });
  }
});

// API to fetch project details with manager info, total bugs, and bug statuses for testers
app.get('/api/projects/tester/:testerId', async (req, res) => {
  const testerId = Number(req.params.testerId);
  console.log("Tester ID:", testerId);

  if (isNaN(testerId) || testerId <= 0) {
    console.error(`Invalid Tester ID received: ${testerId}`);
    return res.status(400).json({ message: 'Invalid Tester ID' });
  }

  try {
    // Find the tester by ID
    const tester = await Tester.findOne({ tester_id: testerId });

    if (!tester) {
      console.warn(`Tester not found for ID: ${testerId}`);
      return res.status(404).json({ message: 'Tester not found' });
    }

    const projectIds = Array.isArray(tester.project_id) 
      ? tester.project_id 
      : tester.project_id ? [tester.project_id] : [];

    if (projectIds.length === 0) {
      console.log(`No projects associated with Tester ID: ${testerId}`);
      return res.status(200).json([]);
    }

    // Fetch projects
    const projects = await Project.find({ project_id: { $in: projectIds } });

    // Fetch managers
    const managers = await ProjectManager.find({ project_id: { $in: projectIds } });

    // Fetch bugs with their status for each project
    const bugData = await Bug.find({ project_id: { $in: projectIds } }, 'project_id bug_name bug_status');

    // Fetch bugs reported and verified by tester
    const reportedBugs = await Bug.find({ bug_id: { $in: tester.bugs_reported } });
    const verifiedBugs = await Bug.find({ bug_id: { $in: tester.bugs_verified } });

    // Aggregate bug count
    const bugCounts = await Bug.aggregate([
      { $match: { project_id: { $in: projectIds } } },
      { $group: { _id: "$project_id", total_bugs: { $sum: 1 } } }
    ]);

    // Map results
    const results = projects.map(project => {
      const manager = managers.find(mgr => mgr.project_id.includes(project.project_id));
      const totalBugs = bugCounts.find(b => b._id === project.project_id)?.total_bugs || 0;
      const bugs = bugData
        .filter(bug => bug.project_id === project.project_id)
        .map(bug => ({ bug_name: bug.bug_name, bug_status: bug.bug_status }));

      const reportedBugsList = reportedBugs
        .filter(bug => bug.project_id === project.project_id)
        .map(bug => ({ bug_name: bug.bug_name, bug_status: bug.bug_status }));

      const verifiedBugsList = verifiedBugs
        .filter(bug => bug.project_id === project.project_id)
        .map(bug => ({ bug_name: bug.bug_name, bug_status: bug.bug_status }));

      return {
        project_name: project.project_name,
        git_id: project.git_id,
        manager_name: manager ? manager.manager_name : "No Manager",
        total_bugs: totalBugs,
        bugs,
        reported_bugs: reportedBugsList,
        verified_bugs: verifiedBugsList,
      };
    });

    console.log(`Successfully fetched project details for Tester ID: ${testerId}`);
    res.json(results);
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/manager/:managerId', async (req, res) => {
  const managerId = Number(req.params.managerId);

  if (isNaN(managerId) || managerId <= 0) {
    console.error(`Invalid Manager ID: ${managerId}`);
    return res.status(400).json({ message: 'Invalid Manager ID' });
  }

  try {
    // Find manager
    const manager = await ProjectManager.findOne({ manager_id: managerId });

    if (!manager || !manager.project_id || manager.project_id.length === 0) {
      console.warn(`No projects found for Manager ID: ${managerId}`);
      return res.status(404).json({ message: 'No projects found for this manager' });
    }

    // Extract project IDs
    const projectIds = manager.project_id;

    // Find developers, testers, and bugs
    const [developers, testers, bugs, projects] = await Promise.all([
      Developer.find({ project_id: { $in: projectIds } }),
      Tester.find({ project_id: { $in: projectIds } }),
      Bug.find({ project_id: { $in: projectIds } }),
      Project.find({ project_id: { $in: projectIds } })
    ]);

    const result = projects.map(project => {
      const projectDevelopers = developers.filter(dev => dev.project_id.includes(project.project_id)).length;
      const projectTesters = testers.filter(tester => tester.project_id.includes(project.project_id)).length;
      const pendingBugs = bugs.filter(bug =>
        bug.project_id === project.project_id && (bug.bug_status === "Open" || bug.bug_status === "In Progress")
      ).length;
      const stuckBugs = bugs.filter(bug =>
        bug.project_id === project.project_id && bug.bug_status === "Reopen"
      ).length;

      return {
        project_name: project.project_name,
        developers_count: projectDevelopers,
        testers_count: projectTesters,
        pending_bugs: pendingBugs,
        stuck_bugs: stuckBugs
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching project data:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/:adminId/projects', async (req, res) => {
  const adminId = Number(req.params.adminId);

  if (isNaN(adminId) || adminId <= 0) {
    return res.status(400).json({ message: 'Invalid Admin ID' });
  }

  try {
    // Find the admin to get the company_id
    const admin = await Admin.findOne({ admin_id: adminId });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const companyId = admin.company_id;

    // Find all projects associated with the company
    const projects = await Project.find({ company_id: companyId });

    if (!projects.length) {
      return res.status(404).json({ message: 'No projects found for this company' });
    }

    // Fetch developers, testers, and managers
    const projectData = await Promise.all(projects.map(async (project) => {
      const developers = await Developer.find({ project_id: project.project_id });
      const testers = await Tester.find({ project_id: project.project_id });
      const manager = await ProjectManager.findOne({ project_id: project.project_id });

      return {
        project_name: project.project_name,
        git_id: project.git_id,
        developers_count: developers.length,
        developers_names: developers.map(dev => dev.developer_name),
        testers_count: testers.length,
        testers_names: testers.map(tester => tester.tester_name),
        manager_name: manager?.manager_name || 'Not Assigned',
      };
    }));

    res.status(200).json(projectData);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/bugs/:bugId', async (req, res) => {
  const bugId = Number(req.params.bugId);

  if (isNaN(bugId)) {
    return res.status(400).json({ message: 'Invalid Bug ID' });
  }

  try {
    const bug = await Bug.findOne({ bug_id: bugId });

    if (!bug) return res.status(404).json({ message: 'Bug not found' });

    const project = await Project.findOne({ project_id: bug.project_id });
    const developer = bug.assigned_to ? await Developer.findOne({ developer_id: bug.assigned_to }) : null;

    res.json({
      bug_name: bug.bug_name,
      project_name: project?.project_name || 'Unknown Project',
      assigned_to_name: developer?.developer_name || 'Unassigned',
      bug_status: bug.bug_status,
      priority: bug.priority,
      due_date: bug.assigned_at || 'Not Set'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET All Developers for Reassignment
app.get('/api/developers', async (req, res) => {
  try {
    const developers = await Developer.find({}, 'developer_id developer_name');
    res.json(developers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE Bug Details (Reassign Developer and Update Due Date)
app.put('/api/bugs/:bugId/update', async (req, res) => {
  const { assigned_to, assigned_at, due_date } = req.body;

  try {
    const bug = await Bug.findOneAndUpdate(
      { bug_id: Number(req.params.bugId) },
      { assigned_to: Number(assigned_to), assigned_at, resolved_at: new Date(due_date) },
      { new: true }
    );

    if (!bug) return res.status(404).json({ message: 'Bug not found' });

    res.json({ message: 'Bug updated successfully', bug });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Project Progess Calculations
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    const projectProgress = await Promise.all(
      projects.map(async (project) => {
        const totalBugs = await Bug.countDocuments({ project_id: project.project_id });
        const resolvedBugs = await Bug.countDocuments({ project_id: project.project_id, bug_status: 'Resolved' });
        const progress = totalBugs > 0 ? (resolvedBugs / totalBugs) * 100 : 0;

        return {
          project_name: project.project_name,
          progress: Math.round(progress),
        };
      })
    );
    res.json(projectProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// ✅ Fetch project statistics
app.get('/api/project-stats/:projectName', async (req, res) => {
  try {
    const { projectName } = req.params;
    console.log(`Fetching data for project: ${projectName}`);

    // Find project by name
    const project = await Project.findOne({ project_name: projectName });
    if (!project) {
      console.error(`Project not found: ${projectName}`);
      return res.status(404).json({ error: 'Project not found' });
    }
    const projectId = project.project_id;

    // Fetch bugs for the project
    const bugs = await Bug.find({ project_id: projectId });

    // Calculate bug status counts
    const statusCounts = {
      Stuck: 0,
      'In Progress': 0,
      Resolved: 0,
      Open: 0,
      Verified: 0,
      Reopen: 0
    };

    bugs.forEach(bug => {
      if (statusCounts[bug.bug_status] !== undefined) {
        statusCounts[bug.bug_status]++;
      } else {
        console.warn(`Unexpected bug status: ${bug.bug_status}`);
      }
    });

    // ✅ Calculate Project Progress
    const totalBugs = bugs.length;
    const resolvedBugs = statusCounts.Resolved || 0;
    const projectProgress = totalBugs > 0 ? (resolvedBugs / totalBugs) * 100 : 100;

    // Get developers and their resolved bug count
    const developers = await Developer.find({ project_id: projectId });
    const devData = developers.map(dev => ({
      name: dev.developer_name,
      bugsResolved: dev.solved_bugs.length,
    }));

    // Get testers and their reported bug count
    const testers = await Tester.find({ project_id: projectId });
    const testerData = testers.map(tester => ({
      name: tester.tester_name,
      bugsReported: tester.bugs_reported.length,
    }));

    // ✅ Send response
    res.json({
      project,
      bugs,
      statusCounts,
      projectProgress: Math.round(projectProgress),
      developers: devData,
      testers: testerData,
    });
  } catch (error) {
    console.error('Error fetching project stats:', error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ✅ Test API Route
app.get("/", (req, res) => {
    res.send("Bug Tracking API is running 🚀");
});
// ✅ Bug status API
app.get("/api/bugs/open", async (req, res) => {
    try {
      const openBugs = await Bug.aggregate([
        {
          $match: {
            bug_status: { $in: ["Open", "Reopen"] }
          }
        },
        {
          $lookup: {
            from: "projects",
            localField: "project_id",
            foreignField: "project_id",
            as: "projectDetails"
          }
        },
        {
          $lookup: {
            from: "developers",
            localField: "assigned_to",
            foreignField: "developer_id",
            as: "developerDetails"
          }
        },
        {
          $unwind: "$projectDetails"
        },
        {
          $unwind: "$developerDetails"
        },
        {
          $project: {
            _id: 0,
            bug_name: 1,
            bug_status: 1,
            priority: 1,
            project_name: "$projectDetails.project_name",
            assigned_to: "$developerDetails.developer_name"
          }
        }
      ]);
  
      res.status(200).json(openBugs);
    } catch (error) {
      console.error("Error fetching bugs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));