const Network = require("../models/Network");

exports.listNetwork = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const networkList = await Network.find({ user_id });
    res.status(200).json({
      data: networkList,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createNetwork = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const { name, cidr, status, gatewayip, project_id } = req.body;
    const networkCreate = await Network.create({
      user_id,
      name,
      cidr,
      status,
      gatewayip,
      project_id,
    });
    res.status(200).json({
      data: networkCreate,
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getNetwork = async function (req, res, next) {
  try {
    let { user_id, network_id } = req.params;
    const networkGet = await Network.findOne({ user_id, _id: network_id });
    if (!networkGet) {
      return res.status(404).json({
        data: {},
        message: "Not Found",
      });
    }
    res.status(200).json({
      data: networkGet,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateNetwork = async function (req, res, next) {
  try {
    let { user_id, network_id } = req.params;
    const { name, cidr, status, gatewayip, project_id } = req.body;
    const networkUpdate = await Network.findOneAndUpdate(
      { user_id, _id: network_id },
      { name, cidr, status, gatewayip, project_id },
      { new: true },
    );
    if (!networkUpdate) {
      return res.status(404).json({
        data: {},
        message: "Network Not Found",
      });
    }
    res.status(200).json({
      data: networkUpdate,
      message: "Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNetwork = async function (req, res, next) {
  try {
    let { user_id, network_id } = req.params;
    const networkDelete = await Network.deleteOne({
      user_id,
      _id: network_id,
    });
    res.status(200).json({
      data: networkDelete,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
