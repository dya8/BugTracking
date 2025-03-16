const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { connectDB, Company, Admin, Project, Developer, Tester, Bug, Chatroom, ProjectManager } = require("./db"); // Import database setup and models

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Generate Unique ID
const counterSchema = new mongoose.Schema({
    entity: { type: String, required: true, unique: true }, // Company, Admin, Developer, Tester, etc.
    count: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

const generateUniqueId = async (entity) => {
    const counter = await Counter.findOneAndUpdate(
        { entity },
        { $inc: { count: 1 } }, // Increment count
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return counter.count;
};


// ✅ Company Signup API (No changes)
app.post("/api/company-signup", async (req, res) => {
    try {
      const { company_name, email } = req.body;
      if (!company_name || !email) {
        return res.status(400).json({ message: "Company name and email are required." });
      }
  
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) return res.status(400).json({ message: "Company with this email already exists!" });
  
      const company_id = await generateUniqueId("Company");
      const company = new Company({ company_id, company_name, email });
      await company.save();
  
      res.status(201).json({ message: "Company Registered Successfully", company_id });
    } catch (error) {
      res.status(500).json({ error: error.message });
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
  
// ✅ Modified Admin Signup API
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

        // ✅ Validate company_id (ensure it's a valid ObjectId)
        if (!mongoose.Types.ObjectId.isValid(company._id)) {
            return res.status(400).json({ message: "Invalid company ID." });
        }

        // ✅ Generate unique admin ID
        const admin_id = await generateUniqueId("Admin");

       
        // ✅ Create new Admin entry
        const admin = new Admin({
            admin_id,
            admin_name,
            email,
            password, // Store hashed password
            company_id: company._id, // Use valid ObjectId
        });

        await admin.save();

        res.status(201).json({ 
            message: "Admin Registered Successfully", 
            admin_id, 
            company_id: company._id 
        });

    } catch (error) {
        console.error("Admin Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

      // Fetch company details using company name
     /* const company = await Company.findOne({ company_name });
      if (!company) return res.status(400).json({ message: "Company not found. Please register first." });

      const admin_id = await generateUniqueId("Admin");
  
      const admin = new Admin({ 
        admin_id, 
        admin_name, 
        email, 
        password, 
        company_id: company.company_id  // Use fetched company_id
      });

      await admin.save();
  
      res.status(201).json({ message: "Admin Registered Successfully", admin_id, company_id: company.company_id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});*/
// ✅ Project Signup API
app.post("/api/project-signup", async (req, res) => {
    try {
        const { project_name, git_id, manager_name, email } = req.body;

        const project_id = await generateUniqueId("Project");
        const manager_id = await generateUniqueId("ProjectManager");

        const project = new Project({ project_id, project_name, git_id });
        await project.save();

        const projectManager = new ProjectManager({
            manager_id,
            project_id,
            manager_name,
            email,
            total_projects_handled: 1
        });

        await projectManager.save();

        res.status(201).json({ message: "Project & Manager Registered Successfully", project_id, manager_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Team Signup API
app.post("/api/team-signup", async (req, res) => {
    try {
        const { collaborators, company_id } = req.body;

        for (const collab of collaborators) {
            const { email, role } = collab;

            const user_id = await generateUniqueId(role);
            const password = "defaultPassword123";

            if (role === "Developer") {
                const developer = new Developer({
                    developer_id: user_id,
                    email,
                    password,
                    company_id
                });
                await developer.save();
            } else if (role === "Tester") {
                const tester = new Tester({
                    tester_id: user_id,
                    email,
                    password,
                    company_id
                });
                await tester.save();
            } else {
                return res.status(400).json({ message: "Invalid role selected!" });
            }
        }

        res.status(201).json({ message: "Team registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// ✅ Test API Route
app.get("/", (req, res) => {
    res.send("Bug Tracking API is running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));