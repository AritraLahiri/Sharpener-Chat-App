const express = require("express");
const authController = require("../controller/auth");
const authMiddleware = require("../middleware/userAuth");
const router = express.Router();
router.post("/signup", authController.signUpUser);
router.post("/login", authController.logInUser);
router.get("/users", authMiddleware, authController.getAllUsers);

module.exports = router;
