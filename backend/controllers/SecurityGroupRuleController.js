const SecurityGroup = require("../models/SecurityGroup");
const SecurityGroupRule = require("../models/SecurityGroupRule");
const { createWithUniqueId } = require("../utils/generate-id");
const { QUOTAS, RULES_PER_SECURITY_GROUP, quotaExceeded } = require("../utils/quotas");
const {
  RULE_TYPES,
  RULE_PROTOCOLS,
  validateRule,
} = require("../utils/security-group-options");

// The security group in the URL must belong to this user and project
const findSecurityGroup = (user_id, project_id, securitygroup_id) =>
  SecurityGroup.exists({ user_id, project_id, securitygroup_id });

const securityGroupNotFound = (res) =>
  res.status(404).json({ data: {}, message: "Security Group Not Found" });

exports.listRuleTypes = async function (req, res) {
  res.status(200).json({ data: RULE_TYPES, message: "Request Processed Successfully" });
};

exports.listRuleProtocols = async function (req, res) {
  res.status(200).json({ data: RULE_PROTOCOLS, message: "Request Processed Successfully" });
};

exports.listRule = async function (req, res, next) {
  try {
    let { user_id, project_id, securitygroup_id } = req.params;
    if (!(await findSecurityGroup(user_id, project_id, securitygroup_id))) {
      return securityGroupNotFound(res);
    }
    const ruleList = await SecurityGroupRule.find(
      { user_id, project_id, security_group_id: securitygroup_id },
      { __v: 0 },
    ).sort({ createdAt: 1 });
    res.status(200).json({
      data: ruleList,
      quota: RULES_PER_SECURITY_GROUP,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createRule = async function (req, res, next) {
  try {
    let { user_id, project_id, securitygroup_id } = req.params;
    if (!(await findSecurityGroup(user_id, project_id, securitygroup_id))) {
      return securityGroupNotFound(res);
    }
    const { error, rule } = validateRule(req.body);
    if (error) return res.status(400).json({ data: {}, message: error });

    const [groupRules, projectRules] = await Promise.all([
      SecurityGroupRule.countDocuments({ user_id, project_id, security_group_id: securitygroup_id }),
      SecurityGroupRule.countDocuments({ user_id, project_id }),
    ]);
    if (groupRules >= RULES_PER_SECURITY_GROUP) {
      return quotaExceeded(res, `a security group can have up to ${RULES_PER_SECURITY_GROUP} rules.`);
    }
    if (projectRules >= QUOTAS.security_group_rules) {
      return quotaExceeded(res, `a project can have up to ${QUOTAS.security_group_rules} security group rules.`);
    }

    const ruleCreate = await createWithUniqueId((security_group_rule_id) =>
      SecurityGroupRule.create({
        security_group_rule_id,
        security_group_id: securitygroup_id,
        user_id,
        project_id,
        ...rule,
      }),
    );
    res.status(200).json({
      data: ruleCreate,
      message: "Rule Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRule = async function (req, res, next) {
  try {
    let { user_id, project_id, securitygroup_id, security_group_rule_id } = req.params;
    const { error, rule } = validateRule(req.body);
    if (error) return res.status(400).json({ data: {}, message: error });

    const ruleUpdate = await SecurityGroupRule.findOneAndUpdate(
      { user_id, project_id, security_group_id: securitygroup_id, security_group_rule_id },
      rule,
      { new: true, projection: { __v: 0 } },
    );
    if (!ruleUpdate) {
      return res.status(404).json({ data: {}, message: "Rule Not Found" });
    }
    res.status(200).json({
      data: ruleUpdate,
      message: "Rule Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRule = async function (req, res, next) {
  try {
    let { user_id, project_id, securitygroup_id, security_group_rule_id } = req.params;
    const ruleDelete = await SecurityGroupRule.deleteOne({
      user_id,
      project_id,
      security_group_id: securitygroup_id,
      security_group_rule_id,
    });
    if (!ruleDelete.deletedCount) {
      return res.status(404).json({ data: {}, message: "Rule Not Found" });
    }
    res.status(200).json({
      data: ruleDelete,
      message: "Rule Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
