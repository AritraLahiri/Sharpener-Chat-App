const express = require("express");
const authController = require("../controller/auth");
const router = express.Router();
router.post("/signup", authController.signUpUser);
router.post("/login", authController.logInUser);
// router.post("/password/forgotpassword", userController.forgotPassword);
// router.get("/password/resetpassword/:id", userController.resetPassword);
// router.post("/password/updatePassword/:id", userController.updatePassword);

module.exports = router;
