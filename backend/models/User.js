const mongoose = require("mongoose");
const AuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user_id: { type: String, default: "" },
  email: { type: String, required: true },
  password: { type: String, required: true },
  state: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  country: { type: String, default: "" },
});

module.exports = mongoose.model("auth", AuthSchema);
