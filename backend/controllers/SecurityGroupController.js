const SecurityGroup = require("../models/SecurityGroup");
const SecurityGroupRule = require("../models/SecurityGroupRule");
const { createWithUniqueId } = require("../utils/generate-id");
const { findUserProject, projectNotFound } = require("../utils/project-access");
const { QUOTAS, quotaExceeded } = require("../utils/quotas");

exports.listSecurityGroup = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    if (!(await findUserProject(user_id, project_id))) return projectNotFound(res);
    const securityGroupList = await SecurityGroup.find({ user_id, project_id }, { __v: 0 });

    // How many rules each security group has
    const ruleCounts = await SecurityGroupRule.aggregate([
      { $match: { user_id, project_id } },
      { $group: { _id: "$security_group_id", count: { $sum: 1 } } },
    ]);
    const countById = Object.fromEntries(ruleCounts.map((r) => [r._id, r.count]));

    res.status(200).json({
      data: securityGroupList.map((group) => ({
        ...group.toJSON(),
        rules_count: countById[group.securitygroup_id] ?? 0,
      })),
      quota: QUOTAS.security_groups,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createSecurityGroup = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    if (!(await findUserProject(user_id, project_id))) return projectNotFound(res);
    if ((await SecurityGroup.countDocuments({ user_id, project_id })) >= QUOTAS.security_groups) {
      return quotaExceeded(res, `a project can have up to ${QUOTAS.security_groups} security groups.`);
    }
    const { name, description } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ data: {}, message: "Name is required" });
    }
    const securityGroupCreate = await createWithUniqueId((securitygroup_id) =>
      SecurityGroup.create({
        securitygroup_id,
        user_id,
        name: name.trim(),
        description: description?.trim() ?? "",
        project_id,
      }),
    );
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
    let { user_id, project_id, securitygroup_id } = req.params;
    const securityGroupGet = await SecurityGroup.findOne({
      user_id,
      project_id,
      securitygroup_id,
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
    let { user_id, project_id, securitygroup_id } = req.params;
    const { name, description } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ data: {}, message: "Name is required" });
    }
    const securityGroupUpdate = await SecurityGroup.findOneAndUpdate(
      { user_id, project_id, securitygroup_id },
      { name: name.trim(), description: description?.trim() ?? "" },
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
    let { user_id, project_id, securitygroup_id } = req.params;
    // Rules have to be removed first
    const rulesCount = await SecurityGroupRule.countDocuments({
      user_id,
      project_id,
      security_group_id: securitygroup_id,
    });
    if (rulesCount > 0) {
      return res.status(400).json({
        data: { rules_count: rulesCount },
        message: `This security group still has ${rulesCount} rule${rulesCount === 1 ? "" : "s"}. Delete the rules first.`,
      });
    }
    const securityGroupDelete = await SecurityGroup.deleteOne({
      user_id,
      project_id,
      securitygroup_id,
    });
    res.status(200).json({
      data: securityGroupDelete,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
