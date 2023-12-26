const express = require("express");
const groupController = require("../controller/group");
const authMiddleware = require("../middleware/userAuth");
const router = express.Router();

router.post("/createGroup", authMiddleware, groupController.createGroup);
router.post("/send/:id", authMiddleware, groupController.sendMessage);
router.get("/receive/:id", authMiddleware, groupController.getMessages);
router.get("/all", authMiddleware, groupController.getAllUserGroups);
router.get("/member/:id", authMiddleware, groupController.getAllPeopleInGroup);
router.post("/leave/:id", authMiddleware, groupController.removeFromGroup);
router.post("/makeAdmin/:id", authMiddleware, groupController.toggleGroupAdmin);
router.post("/isAdmin/:id", authMiddleware, groupController.checkIfUserIsAdmin);

module.exports = router;
