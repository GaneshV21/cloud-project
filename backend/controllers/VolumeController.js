const Volume = require("../models/Volume");
const { createWithUniqueId } = require("../utils/generate-id");
const { findUserProject, projectNotFound } = require("../utils/project-access");
const { QUOTAS, quotaExceeded } = require("../utils/quotas");

exports.listVolume = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    if (!(await findUserProject(user_id, project_id))) return projectNotFound(res);
    const volumeList = await Volume.find({ user_id, project_id }, { __v: 0 });
    res.status(200).json({
      data: volumeList,
      quota: QUOTAS.volumes,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createVolume = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    if (!(await findUserProject(user_id, project_id))) return projectNotFound(res);
    if ((await Volume.countDocuments({ user_id, project_id })) >= QUOTAS.volumes) {
      return quotaExceeded(res, `a project can have up to ${QUOTAS.volumes} volumes.`);
    }
    const { name, volume_type, size, status, attached_to } = req.body;
    const volumeCreate = await createWithUniqueId((volume_id) =>
      Volume.create({
        volume_id,
        user_id,
        name,
        volume_type,
        size,
        status,
        attached_to,
        project_id,
      }),
    );
    res.status(200).json({
      data: volumeCreate,
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getVolume = async function (req, res, next) {
  try {
    let { user_id, project_id, volume_id } = req.params;
    const volumeGet = await Volume.findOne({ user_id, project_id, volume_id });
    if (!volumeGet) {
      return res.status(404).json({
        data: {},
        message: "Not Found",
      });
    }
    res.status(200).json({
      data: volumeGet,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateVolume = async function (req, res, next) {
  try {
    let { user_id, project_id, volume_id } = req.params;
    const { name, volume_type, size, status, attached_to } = req.body;
    const volumeUpdate = await Volume.findOneAndUpdate(
      { user_id, project_id, volume_id },
      { name, volume_type, size, status, attached_to },
      { new: true },
    );
    if (!volumeUpdate) {
      return res.status(404).json({
        data: {},
        message: "Not Found",
      });
    }
    res.status(200).json({
      data: volumeUpdate,
      message: "Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteVolume = async function (req, res, next) {
  try {
    let { user_id, project_id, volume_id } = req.params;
    const volumeDelete = await Volume.deleteOne({
      user_id,
      project_id,
      volume_id,
    });
    res.status(200).json({
      data: volumeDelete,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
