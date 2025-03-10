const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
    bug_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bug' },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
