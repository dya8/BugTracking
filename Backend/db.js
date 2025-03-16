const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/bug_tracking", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

// Define Mongoose Schemas
const companySchema = new mongoose.Schema({
    company_id: { type: Number, required: true, unique: true },
    company_name: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

const adminSchema = new mongoose.Schema({
    admin_id: { type: Number, required: true, unique: true },
    admin_name: { type: String, required: true },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const projectSchema = new mongoose.Schema({
    project_id: { type: Number, required: true, unique: true },
    project_name: { type: String, required: true },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    git_id: { type: String, unique: true }
}, { timestamps: true });

const developerSchema = new mongoose.Schema({
    developer_id: { type: Number, required: true, unique: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    developer_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    total_bugs_solved: { type: Number, default: 0 },
    success_rate: { type: Number, default: 0 },
    solved_bugs: [{
        bug_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bug' },
        bug_type: { type: String },
        resolution_time: { type: Number }
    }]
});

const testerSchema = new mongoose.Schema({
    tester_id: { type: Number, required: true, unique: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    tester_name: { type: String, required: true },
    total_bug_reported: { type: Number, default: 0 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bugs_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bug' }],
    bugs_verified: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bug' }]
});

const bugSchema = new mongoose.Schema({
    bug_id: { type: Number, required: true, unique: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    bug_name: { type: String, required: true },
    bug_status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Verified", "Reopen"],
        default: "Open"
    },
    bug_type: { type: String, required: true },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium"
    },
    reported_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Tester', required: true },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
    assigned_at: { type: Date },
    created_at: { type: Date, default: Date.now },
    resolved_at: { type: Date },
    resolution_time: { type: Number }
});

// Middleware to update resolution_time when bug is resolved
bugSchema.pre('save', function (next) {
    if (this.resolved_at) {
        this.resolution_time = (this.resolved_at - this.created_at) / (1000 * 60 * 60); // Hours
    }
    next();
});

const chatroomSchema = new mongoose.Schema({
    bug_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bug', required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    created_at: { type: Date, default: Date.now },
    messages: [{
        sender_id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'sender_type' },
        sender_type: { type: String, enum: ["Developer", "Tester"], required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
});

const projectManagerSchema = new mongoose.Schema({
    project_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    manager_name: { type: String, required: true },
    total_projects_handled: { type: Number, default: 0 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
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

// Export Models
module.exports = {
    connectDB,
    Company,
    Admin,
    Project,
    Developer,
    Tester,
    Bug,
    Chatroom,
    ProjectManager
};
