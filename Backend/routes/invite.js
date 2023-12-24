const express = require("express");
const inviteController = require("../controller/invite");
const authMiddleware = require("../middleware/userAuth");
const router = express.Router();

router.post("/:userId/:groupId", authMiddleware, inviteController.createInvite);
router.get("/all", authMiddleware, inviteController.getInvites);
router.post("/joinGroup", authMiddleware, inviteController.joinGroup);
router.post("/reject", authMiddleware, inviteController.processInvite);

module.exports = router;
