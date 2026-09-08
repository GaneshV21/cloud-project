const mongoose = require("mongoose");
const NetworkSchema = new mongoose.Schema({
  name: { type: String },
  cidr: { type: String },
  status: { type: String },
  gatewayip: { type: String },
  user_id: { type: String },
  project_id: { type: String },
});

module.exports = mongoose.model("network", NetworkSchema);
