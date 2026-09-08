const express = require("express");
const router = express.Router();
const SecurityGroupController = require("../controllers/SecurityGroupController");
const { AuthMiddleWare } = require("../middlewares/AuthMiddleWare");

router.get(
  "/list/:user_id",
  AuthMiddleWare,
  SecurityGroupController.listSecurityGroup,
);
router.post(
  "/create/:user_id",
  AuthMiddleWare,
  SecurityGroupController.createSecurityGroup,
);
router.get(
  "/get/:user_id/:securitygroup_id",
  AuthMiddleWare,
  SecurityGroupController.getSecurityGroup,
);
router.put(
  "/update/:user_id/:securitygroup_id",
  AuthMiddleWare,
  SecurityGroupController.updateSecurityGroup,
);
router.delete(
  "/delete/:user_id/:securitygroup_id",
  AuthMiddleWare,
  SecurityGroupController.deleteSecurityGroup,
);

module.exports = router;
