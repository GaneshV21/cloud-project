const mongoose = require("mongoose");
const VolumeSchema = new mongoose.Schema({
  // Public id, e.g. "qwert2-gftjaj-ganer22q" (see utils/generate-id.js)
  volume_id: { type: String, required: true, index: { unique: true } },
  name: { type: String },
  volume_type: { type: String },
  size: { type: String },
  status: { type: String },
  attached_to: { type: String },
  user_id: { type: String },
  project_id: { type: String },
});

module.exports = mongoose.model("volume", VolumeSchema);
