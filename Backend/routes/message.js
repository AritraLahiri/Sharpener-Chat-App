const express = require("express");
const messageController = require("../controller/message");
const userAuthMiddleware = require("../middleware/userAuth");
const router = express.Router();
router.post("/send", userAuthMiddleware, messageController.sendMessage);
router.get("/receive", userAuthMiddleware, messageController.getMessages);

module.exports = router;
