const Project = require("../models/Project");
const User = require("../models/User");
const SubUser = require("../models/SubUser");
const Instance = require("../models/Instance");
const Keypair = require("../models/Keypair");
const Network = require("../models/Network");
const SecurityGroup = require("../models/SecurityGroup");
const SecurityGroupRule = require("../models/SecurityGroupRule");
const Volume = require("../models/Volume");
const { createWithUniqueId } = require("../utils/generate-id");
const { QUOTAS } = require("../utils/quotas");
const { adminProjectRole, buildProjectRoles } = require("../utils/project-roles");

exports.listProject = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    // Only the projects listed in the user's project_roles (and still existing)
    const user = await User.findOne({ user_id }, { current_project_id: 1, project_roles: 1 });
    const roleById = Object.fromEntries(
      (user?.project_roles ?? []).map((r) => [r.project_id, r]),
    );
    const projects = await Project.find({ project_id: { $in: Object.keys(roleById) } }).sort({
      createdAt: 1,
    });
    const projectList = projects.map((project) => ({
      ...project.toJSON(),
      role: roleById[project.project_id].role,
      permissions: roleById[project.project_id].permissions,
    }));

    let current_project_id = user?.current_project_id || "";
    // Saved project was deleted: clear it
    if (current_project_id && !projectList.some((p) => p.project_id === current_project_id)) {
      current_project_id = "";
    }
    // Only one project: it's the current one
    if (!current_project_id && projectList.length === 1) {
      current_project_id = projectList[0].project_id;
    }
    if (user && current_project_id !== (user.current_project_id || "")) {
      await User.updateOne({ user_id }, { current_project_id });
    }

    res.status(200).json({
      data: projectList,
      current_project_id,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const { name, description } = req.body;
    const projectCreate = await createWithUniqueId((project_id) =>
      Project.create({
        project_id,
        user_id,
        name,
        description,
      }),
    );
    // The creator is the project's admin, with every permission
    await User.updateOne(
      { user_id },
      { $push: { project_roles: adminProjectRole(projectCreate) } },
    );
    res.status(200).json({
      data: projectCreate,
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getProject = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    const projectGet = await Project.findOne({ user_id, project_id });
    if (!projectGet) {
      return res.status(404).json({
        data: {},
        message: "Project Not Found",
      });
    }
    res.status(200).json({
      data: projectGet,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    const { name, description } = req.body;
    const projectUpdate = await Project.findOneAndUpdate(
      { user_id, project_id },
      { name, description },
      { new: true },
    );
    if (!projectUpdate) {
      return res.status(404).json({
        data: {},
        message: "Not Found",
      });
    }
    // Keep the stored project name in everyone's project_roles in sync
    const renamed = [
      { "project_roles.project_id": project_id },
      { $set: { "project_roles.$[entry].project_name": projectUpdate.name } },
      { arrayFilters: [{ "entry.project_id": project_id }] },
    ];
    await Promise.all([User.updateMany(...renamed), SubUser.updateMany(...renamed)]);
    res.status(200).json({
      data: projectUpdate,
      message: "Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// How many of each resource a project contains
const countProjectResources = async (user_id, project_id) => {
  const filter = { user_id, project_id };
  const [instances, keypairs, networks, security_groups, security_group_rules, volumes] =
    await Promise.all([
      Instance.countDocuments(filter),
      Keypair.countDocuments(filter),
      Network.countDocuments(filter),
      SecurityGroup.countDocuments(filter),
      SecurityGroupRule.countDocuments(filter),
      Volume.countDocuments(filter),
    ]);
  return { instances, keypairs, networks, security_groups, security_group_rules, volumes };
};

const RESOURCE_LABELS = {
  instances: "instance",
  keypairs: "keypair",
  networks: "network",
  security_groups: "security group",
  security_group_rules: "security group rule",
  volumes: "volume",
};

exports.deleteProject = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    const project = await Project.findOne({ user_id, project_id });
    if (!project) {
      return res.status(404).json({
        data: {},
        message: "Project Not Found",
      });
    }

    // Only an empty project can be deleted
    const counts = await countProjectResources(user_id, project_id);
    const remaining = Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([key, count]) => `${count} ${RESOURCE_LABELS[key]}${count === 1 ? "" : "s"}`);
    if (remaining.length) {
      return res.status(400).json({
        data: { counts },
        message: `This project still has ${remaining.join(", ")}. Delete them first.`,
      });
    }

    const projectDelete = await Project.deleteOne({ user_id, project_id });
    // Take the project out of everyone's project_roles, and unselect it where it was current
    await Promise.all(
      [User, SubUser].flatMap((Model) => [
        Model.updateMany(
          { "project_roles.project_id": project_id },
          { $pull: { project_roles: { project_id } } },
        ),
        Model.updateMany({ current_project_id: project_id }, { current_project_id: "" }),
      ]),
    );
    res.status(200).json({
      data: projectDelete,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Saves the project the user is working in as their current_project_id
exports.selectProject = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    const project = await Project.findOne({ user_id, project_id });
    if (!project) {
      return res.status(404).json({
        data: {},
        message: "Project Not Found",
      });
    }
    await User.updateOne({ user_id }, { current_project_id: project_id });
    res.status(200).json({
      data: project,
      message: "Project Selected",
    });
  } catch (error) {
    next(error);
  }
};

// Resource counts for a project's dashboard
exports.projectSummary = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    const project = await Project.findOne({ user_id, project_id });
    if (!project) {
      return res.status(404).json({
        data: {},
        message: "Project Not Found",
      });
    }
    const counts = await countProjectResources(user_id, project_id);
    res.status(200).json({
      data: {
        project,
        counts,
        quotas: QUOTAS,
      },
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Sets which of this user's projects a sub-user can use, and the role in each.
// Body: { projects: [{ project_id, role, permissions }] }; an empty list removes all access.
exports.manageUser = async function (req, res, next) {
  try {
    let { user_id, subuser_id } = req.params;
    const subUser = await SubUser.findOne({ parent_user_id: user_id, subuser_id });
    if (!subUser) {
      return res.status(404).json({
        data: {},
        message: "User Not Found",
      });
    }
    const { project_roles, error } = await buildProjectRoles(user_id, req.body.projects ?? []);
    if (error) {
      return res.status(error === "Project Not Found" ? 404 : 400).json({
        data: {},
        message: error,
      });
    }
    const update = { project_roles };
    // Lost access to the project they were working in
    if (!project_roles.some((r) => r.project_id === subUser.current_project_id)) {
      update.current_project_id = "";
    }
    const subUserUpdate = await SubUser.findOneAndUpdate(
      { parent_user_id: user_id, subuser_id },
      update,
      { new: true, projection: { password: 0, _id: 0, __v: 0 } },
    );
    res.status(200).json({
      data: subUserUpdate,
      message: "User Access Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};
