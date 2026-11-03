const mongoose = require("mongoose");
const Project = require("../models/Project");

// Same modules and actions as the frontend Roles module (src/utils/permissions.js)
const PERMISSION_MODULES = ["instance", "keypair", "network", "security_group", "volume"];
const PERMISSION_ACTIONS = ["read", "create", "update", "delete"];
const ALL_PERMISSIONS = PERMISSION_MODULES.flatMap((module) =>
  PERMISSION_ACTIONS.map((action) => `${module}:${action}`),
);

// Whoever creates a project gets this role in it
const ADMIN_ROLE = "admin";

// One entry of a user's project_roles array
const ProjectRoleSchema = new mongoose.Schema(
  {
    project_id: { type: String, required: true },
    project_name: { type: String, default: "" },
    role: { type: String, required: true },
    permissions: { type: [String], default: [] },
  },
  { _id: false },
);

const adminProjectRole = (project) => ({
  project_id: project.project_id,
  project_name: project.name,
  role: ADMIN_ROLE,
  permissions: ALL_PERMISSIONS,
});

// Turns [{ project_id, role, permissions }] from a request into project_roles entries.
// Every project must belong to owner_id; the project name is taken from the database.
// Returns { project_roles } or { error }.
const buildProjectRoles = async (owner_id, projects) => {
  if (projects === undefined) return { project_roles: [] };
  if (!Array.isArray(projects)) return { error: "projects must be a list" };

  const seen = new Set();
  for (const item of projects) {
    if (!item?.project_id) return { error: "Each project needs a project_id" };
    if (seen.has(item.project_id)) return { error: "A project is listed more than once" };
    seen.add(item.project_id);
    if (!item.role || typeof item.role !== "string") {
      return { error: "Each project needs a role" };
    }
    if (item.role === ADMIN_ROLE) return { error: "The admin role can't be given to users" };
    if (!Array.isArray(item.permissions) || !item.permissions.length) {
      return { error: "Each project needs at least one permission" };
    }
    const unknown = item.permissions.filter((p) => !ALL_PERMISSIONS.includes(p));
    if (unknown.length) return { error: `Unknown permission: ${unknown.join(", ")}` };
  }

  const ownProjects = await Project.find(
    { user_id: owner_id, project_id: { $in: [...seen] } },
    { project_id: 1, name: 1 },
  );
  const nameById = Object.fromEntries(ownProjects.map((p) => [p.project_id, p.name]));
  if (ownProjects.length !== seen.size) return { error: "Project Not Found" };

  return {
    project_roles: projects.map((item) => ({
      project_id: item.project_id,
      project_name: nameById[item.project_id],
      role: item.role,
      permissions: [...new Set(item.permissions)],
    })),
  };
};

module.exports = {
  ALL_PERMISSIONS,
  ADMIN_ROLE,
  ProjectRoleSchema,
  adminProjectRole,
  buildProjectRoles,
};
