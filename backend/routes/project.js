const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");
const { AuthMiddleWare } = require("../middlewares/AuthMiddleWare");

router.get("/list/:user_id", AuthMiddleWare, ProjectController.listProject);
router.post(
  "/create/:user_id",
  AuthMiddleWare,
  ProjectController.createProject,
);
router.get(
  "/get/:user_id/:project_id",
  AuthMiddleWare,
  ProjectController.getProject,
);
router.put(
  "/update/:user_id/:project_id",
  AuthMiddleWare,
  ProjectController.updateProject,
);
router.delete(
  "/delete/:user_id/:project_id",
  AuthMiddleWare,
  ProjectController.deleteProject,
);

module.exports = router;
