const express = require("express");
const router = express.Router();
const KeypairController = require("../controllers/KeypairController");
const { AuthMiddleWare } = require("../middlewares/AuthMiddleWare");

router.get(
  "/list/:user_id/:project_id",
  AuthMiddleWare,
  KeypairController.listKeypair,
);
router.post(
  "/create/:user_id/:project_id",
  AuthMiddleWare,
  KeypairController.createKeypair,
);
router.get(
  "/get/:user_id/:project_id/:keypair_id",
  AuthMiddleWare,
  KeypairController.getKeypair,
);
router.delete(
  "/delete/:user_id/:project_id/:keypair_id",
  AuthMiddleWare,
  KeypairController.deleteKeypair,
);

module.exports = router;
