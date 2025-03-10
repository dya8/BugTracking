const mongoose = require("mongoose");

const testerSchema = new mongoose.Schema({
    project_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    tester_name: String,
    total_bug_reported: Number,
    email: String,
    password: String,
    bugs_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bug' }],
    bugs_verified: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bug' }]
});

module.exports = mongoose.model("Tester", testerSchema);
