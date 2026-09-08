const Volume = require("../models/Volume");

exports.listVolume = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const volumeList = await Volume.find({ user_id }, { __v: 0 });
    res.status(200).json({
      data: volumeList,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createVolume = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const { name, volume_type, size, status, attached_to, project_id } =
      req.body;
    const volumeCreate = await Volume.create({
      user_id,
      name,
      volume_type,
      size,
      status,
      attached_to,
      project_id,
    });
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
    let { user_id, volume_id } = req.params;
    const volumeGet = await Volume.findOne({ user_id, _id: volume_id });
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
    let { user_id, volume_id } = req.params;
    const { name, volume_type, size, status, attached_to, project_id } =
      req.body;
    const volumeUpdate = await Volume.findOneAndUpdate(
      { user_id, _id: volume_id },
      { name, volume_type, size, status, attached_to, project_id },
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
    let { user_id, volume_id } = req.params;
    const volumeDelete = await Volume.deleteOne({
      user_id,
      _id: volume_id,
    });
    res.status(200).json({
      data: volumeDelete,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
