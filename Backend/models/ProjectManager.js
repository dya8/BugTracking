const mongoose = require("mongoose");

const projectManagerSchema = new mongoose.Schema({
    project_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    manager_name: String,
    total_projects_handled: Number,
    email: String,
    password: String
});

module.exports = mongoose.model("ProjectManager", projectManagerSchema);
