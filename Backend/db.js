// Exporting Mongoose Models and Connect to MongoDB
const mongoose = require("mongoose");


const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://diyadileep0806:zsAKnoxDYhyqi0mX@bugtracking.mgjl7.mongodb.net/mydb?retryWrites=true&w=majority", {
         
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
    company_id: { type: Number, ref: 'Company', required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const projectSchema = new mongoose.Schema({
    project_id: { type: Number, required: true, unique: true },
    project_name: { type: String, required: true },
    company_id: { type: Number, ref: 'Company', required: true },
    git_id: { type: String, unique: true }
}, { timestamps: true });

const developerSchema = new mongoose.Schema({
    developer_id: { type: Number, required: true, unique: true },
    project_id: [{ type: Number, ref: 'Project', required: true }],
    company_id: { type: Number, ref: 'Company', required: true },
    developer_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    total_bugs_solved: { type: Number, default: 0 },
    success_rate: { type: Number, default: 0 },
    bugs_assigned:[{type: Number, ref: 'Bug'}],
    solved_bugs: [{
        bug_id: { type: Number, ref: 'Bug' },
        bug_type: { type: String },
        resolution_time: { type: Number }
    }]
});

const testerSchema = new mongoose.Schema({
    tester_id: { type: Number, required: true, unique: true },
    project_id: [{ type: Number, ref: 'Project', required: true }],
    company_id: { type: Number, ref: 'Company', required: true },
    tester_name: { type: String, required: true },
    total_bug_reported: { type: Number, default: 0 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bugs_reported: [{ type: Number, ref: 'Bug' }],
    bugs_verified: [{ type: Number, ref: 'Bug' }]
});

const bugSchema = new mongoose.Schema({
    bug_id: { type: Number, unique: true },
    project_id: { type: Number, ref: 'Project', required: true },
    bug_name: { type: String, required: true },
    bug_status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Verified", "Reopen","Stuck"],
        default: "Open"
    },
    bug_type: { type: String, required: true },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium"
    },
    description: { type: String, required: true },
    comments: { type: String },
    reported_by: { type: Number, ref: 'Tester', required: true },
    assigned_to: { type: Number, ref: 'Developer' , required: true },
    assigned_at: { type: Date },
    created_at: { type: Date, default: Date.now },
    due: {type:Date},
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
    chatroom_id: { type: Number, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    developer_id: { type: Number, ref: 'Developer', required: true },  
    tester_id: { type: Number, ref: 'Tester', required: true },
    messages: [{
        sender_id: { type: Number, required: true, refPath: 'sender_type' },
        sender_type: { type: String, enum: ["Developer", "Tester"], required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
});

const projectManagerSchema = new mongoose.Schema({
    manager_id:{type:Number,unique:true},
    project_id: [{ type: Number, ref: 'Project' }],
    company_id: { type: Number, ref: 'Company', required: true },
    manager_name: { type: String, required: true },
    total_projects_handled: { type: Number, default: 0 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
// Post-save hook to emit an event when a message is added
/*chatroomSchema.post("findOneAndUpdate", function (doc) {
    if (doc) {
      const lastMessage = doc.messages[doc.messages.length - 1]; // Get the last message
      if (lastMessage) {
        global.io.to(`chatroom_${doc.chatroom_id}`).emit("newMessage", lastMessage);
      }
    }
  }); */
  
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
