import mongoose from "mongoose";
import connectDB from "./db.js"; // Ensure correct file extension
import Company from "./models/Company.js";
import Project from "./models/Project.js";
import Developer from "./models/Developer.js";
import Tester from "./models/Tester.js";
import Bug from "./models/Bug.js";
import ProjectManager from "./models/ProjectManager.js";

// 🚀 CONNECT TO DB
connectDB();

const seedDatabase = async () => {
    try {
        // 1️⃣ Add a Company
        const company = await Company.create({
            company_name: "Demon Tech Pvt Ltd",
            email: "contact@demontech.com"
        });

        // 2️⃣ Add a Project
        const project = await Project.create({
            project_name: "Bug Buster",
            company_id: company._id,
            git_id: "demontech/bug-buster"
        });

        // 3️⃣ Add Developers
        const developer1 = await Developer.create({
            project_ids: [project._id],
            developer_name: "Alice Dev",
            total_bugs_solved: 10,
            email: "alice@demontech.com",
            password: "hashed_password",
            success_rate: 85.5,
            solved_bugs: []
        });

        const developer2 = await Developer.create({
            project_ids: [project._id],
            developer_name: "Bob Fixer",
            total_bugs_solved: 5,
            email: "bob@demontech.com",
            password: "hashed_password",
            success_rate: 70.2,
            solved_bugs: []
        });

        // 4️⃣ Add a Tester
        const tester = await Tester.create({
            project_ids: [project._id],
            tester_name: "Charlie Tester",
            total_bug_reported: 15,
            email: "charlie@demontech.com",
            password: "hashed_password",
            bugs_reported: [],
            bugs_verified: []
        });

        // 5️⃣ Add a Bug
        const bug = await Bug.create({
            bug_name: "Login Crash",
            project_id: project._id,
            bug_description: "App crashes on incorrect login attempt.",
            bug_status: "Open",
            bug_type: "Backend",
            priority: "High",
            reported_by: tester._id,
            assigned_to: developer1._id,
            created_at: new Date(),
            resolved_at: null,
            resolution_time: null
        });

        // 6️⃣ Add a Project Manager
        const pm = await ProjectManager.create({
            project_ids: [project._id],
            manager_name: "David PM",
            total_projects_handled: 5,
            email: "david@demontech.com",
            password: "hashed_password"
        });

        console.log("Sample Data Added Successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error Seeding Database:", error);
        mongoose.connection.close();
    }
};

// Run the function
seedDatabase();
