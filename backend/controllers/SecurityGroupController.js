const SecurityGroup = require("../models/SecurityGroup");

exports.listSecurityGroup = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const securityGroupList = await SecurityGroup.find(
      { user_id },
    );
    res.status(200).json({
      data: securityGroupList,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createSecurityGroup = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const { name, rules, description, project_id } = req.body;
    const securityGroupCreate = await SecurityGroup.create({
      user_id,
      name,
      rules,
      description,
      project_id,
    });
    res.status(200).json({
      data: securityGroupCreate,
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getSecurityGroup = async function (req, res, next) {
  try {
    let { user_id, securitygroup_id } = req.params;
    const securityGroupGet = await SecurityGroup.findOne({
      user_id,
      _id: securitygroup_id,
    });
    if (!securityGroupGet) {
      return res.status(404).json({
        data: {},
        message: "Security Group Not Found",
      });
    }
    res.status(200).json({
      data: securityGroupGet,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSecurityGroup = async function (req, res, next) {
  try {
    let { user_id, securitygroup_id } = req.params;
    const { name, rules, description, project_id } = req.body;
    const securityGroupUpdate = await SecurityGroup.findOneAndUpdate(
      { user_id, _id: securitygroup_id },
      { name, rules, description, project_id },
      { new: true },
    );
    if (!securityGroupUpdate) {
      return res.status(404).json({
        data: {},
        message: "Security Group Not Found",
      });
    }
    res.status(200).json({
      data: securityGroupUpdate,
      message: "Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSecurityGroup = async function (req, res, next) {
  try {
    let { user_id, securitygroup_id } = req.params;
    const securityGroupDelete = await SecurityGroup.deleteOne({
      user_id,
      _id: securitygroup_id,
    });
    res.status(200).json({
      data: securityGroupDelete,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
