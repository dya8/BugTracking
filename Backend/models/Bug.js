const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema({
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
        }
    }
});

module.exports = mongoose.model("Bug", bugSchema);
