require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://diyadileep0806:zsAKnoxDYhyqi0mX@bugtracking.mgjl7.mongodb.net/mydb?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// Unique ID Generator
const idCounterSchema = new mongoose.Schema({
    model: String,
    lastId: Number
});
const IdCounter = mongoose.model("IdCounter", idCounterSchema);

const generateUniqueId = async (modelName) => {
    let counter = await IdCounter.findOneAndUpdate(
        { model: modelName },
        { $inc: { lastId: 1 } },
        { new: true, upsert: true }
    );
    return counter.lastId.toString().padStart(8, '0');
};

// Define Schemas
const companySchema = new mongoose.Schema({
    company_id: { type: String, unique: true },
    company_name: String,
    email: String
});

const adminSchema = new mongoose.Schema({
    admin_id: { type: String, unique: true },
    admin_name: String,
    email: String,
    password: String,
    company_id: String
});

const projectSchema = new mongoose.Schema({
    project_id: { type: String, unique: true },
    project_name: String,
    company_id: String,
    git_id: String,
});


const developerSchema = new mongoose.Schema({
    developer_id: { type: String, unique: true },
    developer_name: String,
    email: String,
    password: String,
    company_id: String
});

const testerSchema = new mongoose.Schema({
    tester_id: { type: String, unique: true },
    tester_name: String,
    email: String,
    password: String,
    company_id: String
});
const bugSchema = new mongoose.Schema({
    bug_id: { type: Number, required: true, unique: true },
    bug_name: String,
    bug_status: { type: String, enum: ["Open", "In Progress", "Resolved", "Verified", "Reopen"] },
    bug_type: String,  
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"] },
    reported_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Tester' },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
    created_at: { type: Date, default: Date.now },
    resolved_at: { type: Date },
    resolution_time: {
        type: String, 
        default: function() {
            if (this.resolved_at) {
                const diff = this.resolved_at - this.created_at;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
            return null;
        }
    }
});

const chatroomSchema = new mongoose.Schema({
    chatroom_id: { type: Number, required: true, unique: true },
    bug_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bug' },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    created_at: { type: Date, default: Date.now }
});

const projectManagerSchema = new mongoose.Schema({
    project_id: { type: String, ref: "Project" },
    manager_name: String,
    email: String,
    total_projects_handled: Number,
});


// Create Mongoose Models
const Company = mongoose.model('Company', companySchema);
const Admin = mongoose.model('Admin', adminSchema);
const Project = mongoose.model('Project', projectSchema);
const Developer = mongoose.model('Developer', developerSchema);
const Tester = mongoose.model('Tester', testerSchema);
const Bug = mongoose.model('Bug', bugSchema);
const Chatroom = mongoose.model('Chatroom', chatroomSchema);
const ProjectManager = mongoose.model('ProjectManager', projectManagerSchema);

// JWT Token Function
const generateToken = (id) => {
    return jwt.sign({ id }, "bug_tracking_secret", { expiresIn: "30d" });
};

// ✅ Company Signup API (with duplicate check)
app.post("/api/company-signup", async (req, res) => {
    try {
        const { company_name, email } = req.body;

        // Check if the company already exists
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: "Company with this email already exists!" });
        }

        // Generate a unique company ID
        const company_id = await generateUniqueId("Company");

        // Create and save the new company
        const company = new Company({ company_id, company_name, email });
        await company.save();

        res.status(201).json({ message: "Company Registered Successfully", company_id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Admin Signup API
app.post("/api/admin-signup", async (req, res) => {
    try {
        const { admin_name, email, password, company_id } = req.body;
        const admin_id = await generateUniqueId("Admin");

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ admin_id, admin_name, email, password: hashedPassword, company_id });
        await admin.save();

        res.status(201).json({ message: "Admin Registered Successfully", admin_id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Project Signup API 
app.post("/api/project-signup", async (req, res) => {
    try {
        const { project_name, git_id, manager_name, email } = req.body;
        
        // Generate unique IDs
        const project_id = await generateUniqueId("Project");
        const manager_id = await generateUniqueId("ProjectManager");

        // Create and save the new project
        const project = new Project({ project_id, project_name, git_id });
        await project.save();

        // Save project manager details
        const projectManager = new ProjectManager({
            manager_id, // ✅ Added manager_id
            project_id,
            manager_name,
            email,
            total_projects_handled: 1, // Assuming it's their first project
        });
        await projectManager.save();

        res.status(201).json({ message: "Project & Manager Registered Successfully", project_id, manager_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//✅ Team Signup API
app.post("/api/team-signup", async (req, res) => {
    try {
        const { collaborators, company_id } = req.body; // Ensure company_id is included

        for (const collab of collaborators) {
            const { email, role } = collab;

            // Generate unique ID for the user
            const user_id = await generateUniqueId(role);

            // Default password (not hashed)
            const password = "defaultPassword123";

            if (role === "Developer") {
                const developer = new Developer({
                    developer_id: user_id,
                    email,
                    password, // Plaintext password
                    company_id,
                });
                await developer.save();
            } else if (role === "Tester") {
                const tester = new Tester({
                    tester_id: user_id,
                    email,
                    password, // Plaintext password
                    company_id,
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

        const token = generateToken(user._id);

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
