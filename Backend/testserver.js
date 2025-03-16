

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


// Unique ID Generator Function
const generateUniqueId = async (entity) => {
    const counter = await IdCounter.findOneAndUpdate(
        { entity }, 
        { $inc: { count: 1 } }, 
        { new: true, upsert: true }
    );
    return counter.count;
};

// Define Mongoose Schemas
const companySchema = new mongoose.Schema({
    company_id: { type: Number, required: true, unique: true },
    company_name:{ type: String,required: true},
    email: {type: String, required: true, unique: true}
});

const adminSchema = new mongoose.Schema({
    admin_id: { type: Number, required: true, unique: true },
    admin_name: String,
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    email: { type: String, required: true },
    password: String
});

const projectSchema = new mongoose.Schema({
  project_id: { type: Number, required: true, unique: true },
  project_name: { type: String, required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },  // Reference to Company
  git_id: { type: String, unique: true },  // Ensure git_id is unique
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
      bug_type: String,
      resolution_time: Number 
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
  resolution_time: { 
      type: Number,
      default: function() {
          return this.resolved_at ? (this.resolved_at - this.created_at) / (1000 * 60 * 60) : null;  
      }
  }
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

        

        // Generate a unique admin ID
        const admin_id = await generateUniqueId("Admin");

        

        // Create and save the new admin
        const admin = new Admin({
            admin_id,
            admin_name,
            email,
            password,
            company_id: company._id // Store as ObjectId
        });

        await admin.save();

        res.status(201).json({ message: "Admin Registered Successfully", admin_id });
    } catch (error) {
        console.error("Admin Signup Error:", error);
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
