const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { connectDB, Company, Admin, Project, Developer, Tester, Bug, Chatroom, ProjectManager } = require("./db"); // Import database setup and models
const chatRoutes = require("./routes/chatRoutes");
const setupChatSocket = require("./sockets/chatSocket");

const app = express();
const server = http.createServer(app);
/*const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});*/
app.use(express.json());
app.use(cors());
app.use("/api/chat", chatRoutes);

// Connect to MongoDB
connectDB();
setupChatSocket(server);


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
//project manager report bugs
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
        priority: bug.priority
      }));
  
      res.json(formattedBugs);
    } catch (error) {
      console.error("Error fetching bugs:", error);
      res.status(500).json({ message: "Server error" });
    }
    } );
//Fetching users by manager
app.get("/api/project-users/:managerId", async (req, res) => {
    try {
        console.log("Raw Manager ID from request:", req.params.managerId);
        const managerId = Number(req.params.managerId);
        console.log("Manager ID received:", managerId);

        // Step 1: Find the Project IDs from the Project Manager Table
        const projectManager = await ProjectManager.findOne({ manager_id: managerId });

        if (!projectManager) {
            return res.status(404).json({ message: "Project Manager not found" });
        }

        const projectIds = projectManager.project_id; // This is an array
        console.log("Project IDs fetched:", projectIds);

        // Step 2: Fetch Developers and Testers matching any of the Project IDs
        const developers = await Developer.find({ project_id: { $in: projectIds } })
            .select("developer_id developer_name");

        const testers = await Tester.find({ project_id: { $in: projectIds } })
            .select("tester_id tester_name");

        // Step 3: Format the response
        const users = [
            ...developers.map(user => ({
                id: user.developer_id,
                name: user.developer_name,
                role: "Developer"
            })),
            ...testers.map(user => ({
                id: user.tester_id,
                name: user.tester_name,
                role: "Tester"
            }))
        ];

        res.json(users);
    } catch (error) {
        console.error("Error fetching project users:", error);
        res.status(500).json({ message: "Server error" });
    }
});
//api to fetch developer and company details
 app.get("/api/developer/:developerId", async (req, res) => {
    try {
        console.log("Fetching details for developer:", req.params.developerId);
        const developerId = Number(req.params.developerId);

        // Fetch developer details
        const developer = await Developer.findOne({ developer_id: developerId });
        if (!developer) {
            return res.status(404).json({ message: "Developer not found" });
        }

        // Fetch company details
        const company = await Company.findOne({ company_id: developer.company_id });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Response format
        const responseData = {
            name: developer.developer_name,
            role: "Developer",
            email:developer.developer_email,
            companyName: company.company_name,
            companyEmail:company.email
        };

        res.json(responseData);
    } catch (error) {
        console.error("Error fetching developer details:", error);
        res.status(500).json({ message: "Server error" });
    }
}); 
app.put("/api/developer/:developerId", async (req, res) => {
    try {
        console.log("Updating details for developer:", req.params.developerId);
        const developerId = Number(req.params.developerId);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find developer
        const developer = await Developer.findOne({ developer_id: developerId });
        if (!developer) {
            return res.status(404).json({ message: "Developer not found" });
        }

        // Update details
        developer.developer_email = email;
        developer.password = password; // Hash this in a real app for security
        await developer.save();

// Get manager details
app.get("/api/manager/:id", (req, res) => {
    const managerId = req.params.id;
    const query = "SELECT * FROM manager WHERE id = ?";
    db.query(query, [managerId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Manager not found" });
        res.json(result[0]);
    });
});

// Get company details using company_id
app.get("/api/company/:companyId", (req, res) => {
    const companyId = req.params.companyId;
    const query = "SELECT * FROM company WHERE id = ?";
    db.query(query, [companyId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Company not found" });
        res.json(result[0]);
    });
});        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating developer details:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Test API Route
app.get("/", (req, res) => {
    res.send("Bug Tracking API is running 🚀");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));