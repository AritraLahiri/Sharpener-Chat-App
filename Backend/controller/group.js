const Group = require("../models/group");
const Message = require("../models/groupMessage");
const User = require("../models/user");
const Sequelize = require("sequelize");
const UserToGroup = require("../models/userToGroup");
const Op = Sequelize.Op;

exports.sendMessage = (req, res, next) => {
  const message = req.body.message;
  const groupId = req.params.id;
  Message.create({
    message,
    userId: req.user.id,
    groupId,
  })
    .then((data) => {
      if (!data) res.json(response);
      res.json({ success: true, messageSent: true });
    })
    .catch((e) => res.json({ success: false, message: e.message }));
};
exports.getMessages = (req, res) => {
  const groupId = req.params.id;
  //const lastMesageId = req.params.messageId;
  Message.findAll({
    where: {
      groupId,
    },
    include: User,
  })
    .then((data) => {
      if (!data)
        res.json({
          success: false,
          message: "Messages list not received from API",
        });
      res.status(200).json({
        success: true,
        data,
      });
    })
    .catch((e) => res.json(e.message));
};

exports.createGroup = (req, res) => {
  const name = req.body.groupName;
  const userId = req.user.id;
  Group.create({
    isAdmin: true,
    name,
  })
    .then((data) => {
      if (!data) res.json(response);
      else {
        return UserToGroup.create({ userId, groupId: data.id });
      }
    })
    .then((data) => {
      if (!data)
        res
          .status(404)
          .json({ success: false, message: "User group not created" });
      res.json({ success: true, message: " Group creation success" });
    })
    .catch((e) => res.json({ success: false, message: e.message }));
};

exports.getAllUserGroups = (req, res) => {
  const userId = req.user.id;
  UserToGroup.findAll({
    where: {
      userId,
    },
    include: Group,
  })
    .then((data) => {
      if (!data)
        res.json({
          success: false,
          message: "User Group list not received from API",
        });
      res.status(200).json({
        success: true,
        data,
      });
    })
    .catch((e) => res.json(e.message));
};

exports.getAllPeopleInGroup = (req, res) => {
  const groupId = req.params.id;
  UserToGroup.findAll({
    where: {
      groupId,
    },
    include: User,
  }).then((data) => {
    if (!data)
      res.json({
        success: false,
        message: "User Group People list not received from API",
      });
    res.status(200).json({
      success: true,
      data,
    });
  });
};
