const mongoose = require("mongoose");
const AuthSchema = new mongoose.Schema({
  user_id: { type: String, index: { unique: true }, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "admin" },
  email: { type: String, required: true },
  password: { type: String, required: true },
  state: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  country: { type: String, default: "" },
});

module.exports = mongoose.model("auth", AuthSchema);
