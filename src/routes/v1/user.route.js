const express = require("express");
const userController = require("../../controllers/user.controller");
const userValidations = require("../../validations/user.validation");
const router = express.Router();

//router.get("/", customerController.findAll);
//router.get("/:id", customerController.findById);
router.post("/", userValidations.create, userController.create);
router.post("/login", userValidations.login, userController.login);
router.get("/refresh", userValidations.refresh, userController.refresh);


module.exports = router;