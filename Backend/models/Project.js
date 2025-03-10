const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    project_name: String,
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    git_id: String
});

module.exports = mongoose.model("Project", projectSchema);
