const Project = require("../models/Project");
const { generateId, createWithUniqueId } = require("../utils/generate-id");

exports.listProject = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const projectList = await Project.find({ user_id });
    // Projects created before project_id existed get one the first time they're listed
    await Promise.all(
      projectList
        .filter((project) => !project.project_id)
        .map((project) => {
          project.project_id = generateId();
          return project.save();
        }),
    );
    res.status(200).json({
      data: projectList,
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
    res.status(200).json({
      data: projectUpdate,
      message: "Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    const projectDelete = await Project.deleteOne({
      user_id,
      project_id,
    });
    res.status(200).json({
      data: projectDelete,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
