const mongoose = require("mongoose");
const SecurityGroupSchema = new mongoose.Schema({
  name: { type: String },
  rules: { type: Array, default: [] },
  description: { type: String },
  user_id: { type: String },
  project_id: { type: String },
});

module.exports = mongoose.model("securitygroup", SecurityGroupSchema);
