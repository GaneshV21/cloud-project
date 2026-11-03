const mongoose = require("mongoose");
const { ProjectRoleSchema } = require("../utils/project-roles");
const SubUserSchema = new mongoose.Schema({
  subuser_id: { type: String, required: true, index: { unique: true } },
  parent_user_id: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: { unique: true } },
  password: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  current_project_id: { type: String, default: "" },
  // Projects of the parent user this sub-user can use, with a role and permissions in each
  project_roles: { type: [ProjectRoleSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("subuser", SubUserSchema);
