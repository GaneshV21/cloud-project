const mongoose = require("mongoose");
const VolumeSchema = new mongoose.Schema({
  name: { type: String },
  volume_type: { type: String },
  size: { type: String },
  status: { type: String },
  attached_to: { type: String },
  user_id: { type: String },
  project_id: { type: String },
});

module.exports = mongoose.model("volume", VolumeSchema);
