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
  "/summary/:user_id/:project_id",
  AuthMiddleWare,
  ProjectController.projectSummary,
);
router.put(
  "/select/:user_id/:project_id",
  AuthMiddleWare,
  ProjectController.selectProject,
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
router.put(
  "/manage-user/:user_id/:subuser_id",
  AuthMiddleWare,
  ProjectController.manageUser,
);

module.exports = router;
