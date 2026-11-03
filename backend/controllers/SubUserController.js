const SubUser = require("../models/SubUser");
const User = require("../models/User");
const { hashPassword } = require("../utils/jwt");
const { createWithUniqueId } = require("../utils/generate-id");
const { buildProjectRoles } = require("../utils/project-roles");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same rules as the Add User form: 8+ characters, a capital letter, a number, a special character
const PASSWORD_RULES = [
  [(p) => p.length >= 8, "at least 8 characters"],
  [(p) => /[A-Z]/.test(p), "a capital letter"],
  [(p) => /\d/.test(p), "a number"],
  [(p) => /[^A-Za-z0-9\s]/.test(p), "a special character"],
];

// Never send the password hash (or Mongo internals) back
const toPublic = (subUser) => {
  const { password, _id, __v, ...rest } = subUser.toJSON();
  return rest;
};

exports.listSubUser = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const subUsers = await SubUser.find({ parent_user_id: user_id }).sort({ createdAt: 1 });
    res.status(200).json({
      data: subUsers.map(toPublic),
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createSubUser = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password ?? "";

    if (!name) return res.status(400).json({ data: {}, message: "Name is required" });
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ data: {}, message: "Enter a valid email address" });
    }
    const missing = PASSWORD_RULES.filter(([test]) => !test(password)).map(([, label]) => label);
    if (missing.length) {
      return res.status(400).json({
        data: {},
        message: `Password needs ${missing.join(", ")}`,
      });
    }

    // One email = one login, across main accounts and sub-users
    const [subUserExists, userExists] = await Promise.all([
      SubUser.exists({ email }),
      User.exists({ email }),
    ]);
    if (subUserExists || userExists) {
      return res.status(400).json({ data: {}, message: "A user with this email already exists" });
    }

    // Exactly one project at creation: [{ project_id, role, permissions }].
    // More are given later through the project manage-user API.
    const { projects } = req.body;
    if (!Array.isArray(projects) || projects.length !== 1) {
      return res.status(400).json({ data: {}, message: "Select one project for the user" });
    }
    const { project_roles, error } = await buildProjectRoles(user_id, projects);
    if (error) {
      return res.status(error === "Project Not Found" ? 404 : 400).json({
        data: {},
        message: error,
      });
    }

    const hashedPassword = await hashPassword(password);
    const subUserCreate = await createWithUniqueId((subuser_id) =>
      SubUser.create({
        subuser_id,
        parent_user_id: user_id,
        name,
        email,
        password: hashedPassword,
        project_roles,
      }),
    );
    res.status(200).json({
      data: toPublic(subUserCreate),
      message: "User Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Removes the sub-user from the collection (only the parent who created them can)
exports.deleteSubUser = async function (req, res, next) {
  try {
    let { user_id, subuser_id } = req.params;
    const subUserDelete = await SubUser.findOneAndDelete({ parent_user_id: user_id, subuser_id });
    if (!subUserDelete) {
      return res.status(404).json({
        data: {},
        message: "User Not Found",
      });
    }
    res.status(200).json({
      data: toPublic(subUserDelete),
      message: "User Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
