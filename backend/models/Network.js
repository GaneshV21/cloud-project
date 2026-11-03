const mongoose = require("mongoose");
const NetworkSchema = new mongoose.Schema({
  // Public id, e.g. "qwert2-gftjaj-ganer22q" (see utils/generate-id.js)
  network_id: { type: String, required: true, index: { unique: true } },
  name: { type: String },
  cidr: { type: String },
  status: { type: String },
  gatewayip: { type: String },
  user_id: { type: String },
  project_id: { type: String },
});

module.exports = mongoose.model("network", NetworkSchema);
