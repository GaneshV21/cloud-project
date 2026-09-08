const express = require("express");
const router = express.Router();
const VolumeController = require("../controllers/VolumeController");
const { AuthMiddleWare } = require("../middlewares/AuthMiddleWare");

router.get("/list/:user_id", AuthMiddleWare, VolumeController.listVolume);
router.post(
  "/create/:user_id",
  AuthMiddleWare,
  VolumeController.createVolume,
);
router.get(
  "/get/:user_id/:volume_id",
  AuthMiddleWare,
  VolumeController.getVolume,
);
router.put(
  "/update/:user_id/:volume_id",
  AuthMiddleWare,
  VolumeController.updateVolume,
);
router.delete(
  "/delete/:user_id/:volume_id",
  AuthMiddleWare,
  VolumeController.deleteVolume,
);

module.exports = router;
