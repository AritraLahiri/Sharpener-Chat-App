const express = require("express");
const messageController = require("../controller/message");
const userAuthMiddleware = require("../middleware/userAuth");
const router = express.Router();
router.post("/send", userAuthMiddleware, messageController.sendMessage);
//router.post("/receive", authController.logInUser);
// router.post("/password/forgotpassword", userController.forgotPassword);
// router.get("/password/resetpassword/:id", userController.resetPassword);
// router.post("/password/updatePassword/:id", userController.updatePassword);

module.exports = router;
