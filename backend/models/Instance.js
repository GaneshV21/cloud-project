const mongoose = require("mongoose");
const InstanceSchema = new mongoose.Schema({
  instance_id: { type: String, required: true, index: { unique: true } },
  name: { type: String },
  status: { type: String },
  os: { type: String },
  ip: { type: String },
  cpu: { type: String },
  ram: { type: String },
  keypair: { type: String },
  network: { type: String },
  user_id: { type: String },
  project_id: { type: String },
});

module.exports = mongoose.model("instance", InstanceSchema);
