const express = require("express");
const router = express.Router();
const SecurityGroupController = require("../controllers/SecurityGroupController");
const SecurityGroupRuleController = require("../controllers/SecurityGroupRuleController");
const { AuthMiddleWare } = require("../middlewares/AuthMiddleWare");

router.get(
  "/list/:user_id/:project_id",
  AuthMiddleWare,
  SecurityGroupController.listSecurityGroup,
);
router.post(
  "/create/:user_id/:project_id",
  AuthMiddleWare,
  SecurityGroupController.createSecurityGroup,
);
router.get(
  "/get/:user_id/:project_id/:securitygroup_id",
  AuthMiddleWare,
  SecurityGroupController.getSecurityGroup,
);
router.put(
  "/update/:user_id/:project_id/:securitygroup_id",
  AuthMiddleWare,
  SecurityGroupController.updateSecurityGroup,
);
router.delete(
  "/delete/:user_id/:project_id/:securitygroup_id",
  AuthMiddleWare,
  SecurityGroupController.deleteSecurityGroup,
);

// Rule options
router.get(
  "/rule/types/:user_id",
  AuthMiddleWare,
  SecurityGroupRuleController.listRuleTypes,
);
router.get(
  "/rule/protocols/:user_id",
  AuthMiddleWare,
  SecurityGroupRuleController.listRuleProtocols,
);

// Rules of a security group
router.get(
  "/rule/list/:user_id/:project_id/:securitygroup_id",
  AuthMiddleWare,
  SecurityGroupRuleController.listRule,
);
router.post(
  "/rule/create/:user_id/:project_id/:securitygroup_id",
  AuthMiddleWare,
  SecurityGroupRuleController.createRule,
);
router.put(
  "/rule/update/:user_id/:project_id/:securitygroup_id/:security_group_rule_id",
  AuthMiddleWare,
  SecurityGroupRuleController.updateRule,
);
router.delete(
  "/rule/delete/:user_id/:project_id/:securitygroup_id/:security_group_rule_id",
  AuthMiddleWare,
  SecurityGroupRuleController.deleteRule,
);

module.exports = router;
