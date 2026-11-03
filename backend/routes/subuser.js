const express = require("express");
const router = express.Router();
const SubUserController = require("../controllers/SubUserController");
const { AuthMiddleWare } = require("../middlewares/AuthMiddleWare");

// Sub-users aren't tied to a project: everything is scoped by the parent's user_id
router.get("/list/:user_id", AuthMiddleWare, SubUserController.listSubUser);
router.post("/create/:user_id", AuthMiddleWare, SubUserController.createSubUser);
router.delete("/delete/:user_id/:subuser_id", AuthMiddleWare, SubUserController.deleteSubUser);

module.exports = router;
