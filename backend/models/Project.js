const mongoose = require("mongoose");
const ProjectSchema = new mongoose.Schema({
  // Public project id, e.g. "qwert2-gftjaj-ganer22q" (see utils/generate-id.js)
  project_id: { type: String, required: true, index: { unique: true } },
  name: { type: String },
  description: { type: String },
  user_id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("project", ProjectSchema);
