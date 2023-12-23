const express = require("express");
const groupController = require("../controller/group");
const authMiddleware = require("../middleware/userAuth");
const router = express.Router();

router.post("/createGroup", authMiddleware, groupController.createGroup);
router.post("/send/:id", authMiddleware, groupController.sendMessage);
router.get("/receive/:id", authMiddleware, groupController.getMessages);

module.exports = router;
