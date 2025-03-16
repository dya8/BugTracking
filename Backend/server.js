// Initialize Express in Node.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// Load MongoDB URI from .env
const MONGO_URI =
  "mongodb+srv://diyadileep0806:zsAKnoxDYhyqi0mX@bugtracking.mgjl7.mongodb.net/mydb?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });


// JWT Token Function
const generateToken = (id) => {
  return jwt.sign({ id }, "bug_tracking"|| "secret", {
    expiresIn: "30d",
  });
};
// ✅ User Login API
router.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      let user = await user.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid Email or Password" });
  
      // Check Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid Email or Password" });
  
      // Generate JWT Token
      const token = generateToken(user._id);
  
      res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

  // ✅ Company Signup API
  router.post("/api/auth/company-signup", async (req, res) => {
    try {
      const { company_name, email } = req.body;
  
      // Check if company already exists
      let company = await Company.findOne({ email });
      if (company) return res.status(400).json({ message: "Company already exists" });
  
      
  
      // Create new company
      company = new Company({ company_name, email});
      await company.save();
  
      // Generate JWT Token
      const token = generateToken(company._id);
  
      res.status(201).json({ message: "Company Registered Successfully", token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // ✅ Admin Signup API
 router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Create a new user and save it to the database
    const newAdmin = new Admin({
      name,
      email,
      password, // Storing password as plain text
    });

    await newAdmin.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Try again later!" });
  }
});



  
  // ✅ Project Team Signup API
  
app.post("/api/project-signup", async (req, res) => {
  const { name, email, githubId } = req.body;

  try {
    const newProject = new Project({ name, email, githubId });
    await newProject.save();
    res.status(201).json({ message: "Project signup successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Try again later!" });
  }
});
  // ✅ Add Collaborators API

app.post("/api/team-signup", async (req, res) => {
  const { collaborators } = req.body;

  if (!collaborators || !Array.isArray(collaborators) || collaborators.length === 0) {
    return res.status(400).json({ message: "At least one collaborator is required!" });
  }

  try {
    for (const collab of collaborators) {
      if (collab.role === "Developer") {
        await Developer.create({ email: collab.email, role: collab.role });
      } else if (collab.role === "Tester") {
        await Tester.create({ email: collab.email, role: collab.role });
      } else {
        return res.status(400).json({ message: "Invalid role. Must be 'Developer' or 'Tester'." });
      }
    }

    res.status(201).json({ message: "Team setup successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Try again later!" });
  }
});
// ✅ Test API Route
app.get("/", (req, res) => {
  res.send("Bug Tracking API is running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));