const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    company_name: String,
    email: String
});

module.exports = mongoose.model("Company", companySchema);
