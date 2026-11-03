const Instance = require("../models/Instance");
const { createWithUniqueId } = require("../utils/generate-id");
const { findUserProject, projectNotFound } = require("../utils/project-access");
const { QUOTAS, quotaExceeded } = require("../utils/quotas");

exports.listInstance = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    if (!(await findUserProject(user_id, project_id))) return projectNotFound(res);
    const instanceList = await Instance.find({ user_id, project_id });
    res.status(200).json({
      data: instanceList,
      quota: QUOTAS.instances,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createInstance = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    if (!(await findUserProject(user_id, project_id))) return projectNotFound(res);
    if ((await Instance.countDocuments({ user_id, project_id })) >= QUOTAS.instances) {
      return quotaExceeded(res, `a project can have up to ${QUOTAS.instances} instances.`);
    }
    const { name, os, ip, network, keypair, status, cpu, ram } = req.body;
    const instanceCreate = await createWithUniqueId((instance_id) =>
      Instance.create({
        instance_id,
        user_id,
        project_id,
        name,
        os,
        ip,
        network,
        keypair,
        status,
        cpu,
        ram,
      }),
    );
    res.status(200).json({
      data: instanceCreate,
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getInstance = async function (req, res, next) {
  try {
    let { user_id, project_id, instance_id } = req.params;
    const instanceGet = await Instance.findOne({ user_id, project_id, instance_id });
    if (!instanceGet) {
      return res.status(404).json({
        data: {},
        message: "Not Found",
      });
    }
    res.status(200).json({
      data: instanceGet,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteInstance = async function (req, res, next) {
  try {
    let { user_id, project_id, instance_id } = req.params;
    const instanceDelete = await Instance.deleteOne({
      user_id,
      project_id,
      instance_id,
    });
    res.status(200).json({
      data: instanceDelete,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
