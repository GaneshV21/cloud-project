const mongoose = require("mongoose");
const KeypairSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  fingerprint: { type: String, default: "" },
  public_key: { type: String, default: "" },
  user_id: { type: String },
  project_id: { type: String },
});

module.exports = mongoose.model("keypair", KeypairSchema);
