require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Load MongoDB URI from .env file
const MONGO_URI = "mongodb+srv://diyadileep0806:zsAKnoxDYhyqi0mX@bugtracking.mgjl7.mongodb.net/mydb?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1); // Exit process on failure
});

const app = express();
app.use(express.json()); // Middleware for JSON parsing

// Define Mongoose Schemas
const companySchema = new mongoose.Schema({
    company_id: { type: Number, required: true, unique: true },
    company_name: String,
    email: String
});

const adminSchema = new mongoose.Schema({
    admin_id: { type: Number, required: true, unique: true },
    admin_name: String,
    email: String,
    password: String
});

const projectSchema = new mongoose.Schema({
    project_id: { type: Number, required: true, unique: true },
    project_name: String,
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    git_id: String
});

const developerSchema = new mongoose.Schema({
    developer_id: { type: Number, required: true, unique: true },
    project_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], 
    developer_name: String,
    total_bugs_solved: Number,
    email: String,
    password: String,
    success_rate: Number,  
    solved_bugs: [{ 
        bug_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bug' }, 
        bug_type: String,
        resolution_time: Number
    }]
});

const testerSchema = new mongoose.Schema({
    tester_id: { type: Number, required: true, unique: true },
    project_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], 
    tester_name: String,
    total_bug_reported: Number,
    email: String,
    password: String,
    bugs_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bug' }],
    bugs_verified: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bug' }]
});

const bugSchema = new mongoose.Schema({
    bug_id: { type: Number, required: true, unique: true },
    bug_name: String,
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    bug_description: String,
    bug_status: { type: String, enum: ["Open", "In Progress", "Resolved", "Verified", "Reopen"] },
    bug_type: String,  
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"] },
    reported_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Tester' },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
    created_at: { type: Date, default: Date.now },
    resolved_at: { type: Date },
    resolution_time: { 
        type: Number,  
        default: function() {
            return this.resolved_at ? (this.resolved_at - this.created_at) / (1000 * 60 * 60) : null;  
        } // Store as hours instead of "HH:MM:SS"
    }
});

const chatroomSchema = new mongoose.Schema({
    chatroom_id: { type: Number, required: true, unique: true },
    bug_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bug' },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    created_at: { type: Date, default: Date.now }
});

const projectManagerSchema = new mongoose.Schema({
    project_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], 
    manager_name: String,
    total_projects_handled: Number,
    email: String,
    password: String
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

// Test Route
app.get('/', (req, res) => {
    res.send('Bug Tracking API is running 🚀');
});

// API Route to Create a Company
app.post('/company', async (req, res) => {
    try {
        const { company_id, company_name, email } = req.body;
        const newCompany = new Company({ company_id, company_name, email });
        await newCompany.save();
        res.status(201).json({ message: 'Company Created Successfully', company: newCompany });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));