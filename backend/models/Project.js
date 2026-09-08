const mongoose = require("mongoose");
const ProjectSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  user_id: { type: String },
});

module.exports = mongoose.model("project", ProjectSchema);
