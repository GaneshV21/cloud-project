const mongoose = require("mongoose");
const { ProjectRoleSchema } = require("../utils/project-roles");
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
  // Project the user is working in (a project's project_id), "" when none is selected
  current_project_id: { type: String, default: "" },
  // Projects the user can use, with their role and permissions in each (admin in their own)
  project_roles: { type: [ProjectRoleSchema], default: [] },
});

module.exports = mongoose.model("auth", AuthSchema);
