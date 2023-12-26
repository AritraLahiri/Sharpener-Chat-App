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
    name,
  })
    .then((data) => {
      if (!data) res.json(response);
      else {
        return UserToGroup.create({ userId, groupId: data.id, isAdmin: true });
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

exports.removeFromGroup = (req, res) => {
  const groupId = req.params.id;
  UserToGroup.findOne({
    where: {
      groupId,
      userId: req.user.id,
    },
  })
    .then((userGroup) => {
      console.log(userGroup);
      if (!userGroup)
        res.json({
          success: false,
          message: "Member not removed before delete from Group from API",
        });
      else
        return userGroup.destroy({
          where: {
            groupId,
            userId: req.user.id,
          },
        });
    })
    .then((data) => {
      if (!data)
        res.json({
          success: false,
          message: "Member not removed from Group from API",
        });
      else
        res.status(200).json({
          success: true,
          message: "Member removed from the Group",
        });
    })
    .catch((e) => res.json(e));
};
exports.toggleGroupAdmin = (req, res) => {
  const groupId = req.params.id;
  UserToGroup.findOne({
    where: {
      groupId,
      userId: req.user.id,
    },
    include: User,
  })
    .then((userGroup) => {
      if (!userGroup)
        res.json({
          success: false,
          message: "Member admin not toggled from API",
        });
      return userGroup.update({ isAdmin: !userGroup.isAdmin });
    })
    .then((data) => {
      if (!data)
        res.json({
          success: false,
          message: "Member admin not toggled from API",
        });
      res.status(200).json({
        success: true,
        message: "Member admin toggled from API",
      });
    })
    .catch((e) => res.json(e));
};

exports.checkIfUserIsAdmin = (req, res) => {
  const userId = req.user.id;
  const groupId = req.params.id;
  UserToGroup.findOne({
    where: {
      userId,
      groupId,
    },
  })
    .then((data) => {
      if (!data)
        res.json({
          success: false,
          message: "User isAdmin not received from API",
        });
      else res.status(200).json({ success: true, isAdmin: data.isAdmin });
    })
    .catch((e) => res.json(e));
};
