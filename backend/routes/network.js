const express = require("express");
const router = express.Router();
const NetworkController = require("../controllers/NetworkController");
const { AuthMiddleWare } = require("../middlewares/AuthMiddleWare");

router.get("/list/:user_id", AuthMiddleWare, NetworkController.listNetwork);
router.post(
  "/create/:user_id",
  AuthMiddleWare,
  NetworkController.createNetwork,
);
router.get(
  "/get/:user_id/:network_id",
  AuthMiddleWare,
  NetworkController.getNetwork,
);
router.put(
  "/update/:user_id/:network_id",
  AuthMiddleWare,
  NetworkController.updateNetwork,
);
router.delete(
  "/delete/:user_id/:network_id",
  AuthMiddleWare,
  NetworkController.deleteNetwork,
);

module.exports = router;
