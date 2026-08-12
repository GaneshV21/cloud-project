const express = require("express");
const router = express.Router();
const InstanceController = require("../controllers/InstanceController");

router.get("/list/:user_id", InstanceController.listInstance);
router.post("/create/:user_id", InstanceController.createInstance);
router.get("/get/:user_id/:instance_id", InstanceController.getInstance);
router.delete(
  "/delete/:user_id/:instance_id",
  InstanceController.deleteInstancess,
);

module.exports = router;
