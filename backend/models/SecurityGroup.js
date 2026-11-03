const mongoose = require("mongoose");
const SecurityGroupSchema = new mongoose.Schema({
  // Public id, e.g. "qwert2-gftjaj-ganer22q" (see utils/generate-id.js)
  securitygroup_id: { type: String, required: true, index: { unique: true } },
  name: { type: String },
  // Rules live in their own collection (models/SecurityGroupRule.js)
  description: { type: String },
  user_id: { type: String },
  project_id: { type: String },
});

module.exports = mongoose.model("securitygroup", SecurityGroupSchema);
