const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Developer", developerSchema);
