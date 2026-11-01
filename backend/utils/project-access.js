const Project = require("../models/Project");

// The project in the URL must belong to the logged-in user
const findUserProject = (user_id, project_id) => Project.exists({ user_id, project_id });

const projectNotFound = (res) =>
  res.status(404).json({ data: {}, message: "Project Not Found" });

module.exports = { findUserProject, projectNotFound };
