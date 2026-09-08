const express = require("express");
const router = express.Router();
const InstanceController = require("../controllers/InstanceController");
const { AuthMiddleWare } = require("../middlewares/AuthMiddleWare");

router.get("/list/:user_id", AuthMiddleWare, InstanceController.listInstance);
router.post(
  "/create/:user_id",
  AuthMiddleWare,
  InstanceController.createInstance,
);
router.get(
  "/get/:user_id/:instance_id",
  AuthMiddleWare,
  InstanceController.getInstance,
);
router.delete(
  "/delete/:user_id/:instance_id",
  AuthMiddleWare,
  InstanceController.deleteInstance,
);

module.exports = router;
